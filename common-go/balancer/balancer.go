package balancer

import (
	"sync"
	"time"
	"gopkg.in/resty.v1"
	"sort"
	"fmt"
	"gitlab.com/ofamily/common-go/discovery"
)

const (
	DEFAULT_DELAY = 10 * time.Second
)

type BalanceStrategy interface {
	Balance(config *BalanceConfig, rawGateways *RawGateways) *Gateways
}

type BalanceConfig struct {
	Discovery       string
	Delay           time.Duration
	BalanceStrategy BalanceStrategy
}

type Gateways map[string]Endpoints
type RawGateways map[string][]string

type Endpoints []BalanceEndpoint

type BalanceEndpoint struct {
	Url     string
	Latency int64
}

func (s Endpoints) Len() int {
	return len(s)
}
func (s Endpoints) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s Endpoints) Less(i, j int) bool {
	return s[i].Latency > s[j].Latency
}

var (
	gateways *Gateways
	mutex    sync.RWMutex
)

func AsClientLoadBalancer(config *BalanceConfig) {

	go func() {
		for {
			response, err := resty.R().
				SetResult(RawGateways{}).
				Get(config.Discovery + "/endpoints")
			if err != nil {
				fmt.Printf("[BALANCE] Discovery service is unreachable: %v", err)
			}
			rawGateways := response.Result().(*RawGateways)
			newGateways := config.BalanceStrategy.Balance(config, rawGateways)
			mutex.Lock()
			gateways = newGateways
			mutex.Unlock()
			time.Sleep(config.Delay)
		}
	}()
}

func ReadGateways(reader func(*Gateways)) {
	mutex.RLock()
	reader(gateways)
	mutex.RUnlock()
}

func BestGateway(service string) string {
	best := ""
	ReadGateways(func(gateways *Gateways) {
		urls := (*gateways)[service]
		sort.Sort(Endpoints(urls))
		if len(urls) > 0 {
			best = urls[0].Url
		}
	})
	return best
}

func DefaultBalanceConfig() *BalanceConfig {
	return &BalanceConfig{
		Discovery:       discovery.Url(discovery.DEFAULT_DISCOVERY_URL),
		BalanceStrategy: PingBalancer{},
		Delay:           DEFAULT_DELAY,
	}
}
