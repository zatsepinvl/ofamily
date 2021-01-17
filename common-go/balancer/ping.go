package balancer

import (
	"gopkg.in/resty.v1"
	"fmt"
	"github.com/gin-gonic/gin"
)

type PingBalancer struct{}

func (p PingBalancer) Balance(config *BalanceConfig, rawGateways *RawGateways) *Gateways {
	gateways := make(Gateways, 0)
	for service, urls := range *rawGateways {
		gateways[service] = make(Endpoints, len(urls))
		for i, url := range urls {
			response, err := resty.R().Get(fmt.Sprintf("http://%v/ping", url))
			latency := int64(1<<63 - 1)
			if err == nil {
				latency = response.Time().Nanoseconds() / 1000000
			}
			gateways[service][i] = BalanceEndpoint{
				Url:     url,
				Latency: latency,
			}
		}
	}
	return &gateways
}

func AsPingable(r gin.IRouter) {
	r.GET("/ping", Ping)
}

func Ping(c *gin.Context) {
	c.String(200, "pong")
}
