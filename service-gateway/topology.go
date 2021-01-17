package main

import (
	"sync"
	"gopkg.in/resty.v1"
	"fmt"
	"strconv"
	"time"
	"gitlab.com/ofamily/common-go/balancer"
	"gitlab.com/ofamily/common-go/topology"
)

const (
	request_timeout = time.Duration(1000) * time.Second / 1000 /*1000ms*/
)

func topologyFromGateways(gateways *balancer.Gateways) *topology.Entry {
	topologies := make([]topology.Entry, 0)
	wt := sync.WaitGroup{}
	for service, endpoints := range *gateways {
		for i, ep := range endpoints {
			wt.Add(1)
			go func(name string, endpoint balancer.BalanceEndpoint) {
				response, err := resty.SetTimeout(request_timeout).
					R().
					SetResult(topology.Entry{}).
					Get(fmt.Sprintf("http://%v/topology", endpoint.Url))
				if err != nil {
					topologies = append(topologies, topology.Entry{
						Service: name,
						Url:     endpoint.Url,
						Type:    topology.UNDEFINED,
						Latency: 1<<31 - 1,
					})
				} else {
					entry := response.Result().(*topology.Entry)
					entry.Service = name
					entry.Latency = int(response.Time().Nanoseconds() / 1000000)
					topologies = append(topologies, *entry)
				}
				wt.Done()
			}(service+"_"+strconv.Itoa(i+1), ep)
		}
	}
	wt.Wait()
	return &topology.Entry{
		Service:     "gateway-service",
		Url:         urlAddress,
		Type:        topology.SERVICE,
		Connections: topologies,
	}
}
