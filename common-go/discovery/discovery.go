package discovery

import (
	"gopkg.in/resty.v1"
	"time"
	"fmt"
	"github.com/gin-gonic/gin"
	common "gitlab.com/ofamily/common-go"
)

type HeartbeatConfig struct {
	Service          string
	Expiration       int /*seconds; 0 - never*/
	Url              string
	Timeout          time.Duration
	DefaultDiscovery string
}

type Endpoint struct {
	Service    string `json:"service" binding:"required"`
	Url        string `json:"url" binding:"required"`
	Expiration int `json:"expiration" binding:"required"`
}

const (
	DEFAULT_EXPIRATION    = 60 /*60 sec*/
	HEARTBEAT_TIMEOUT     = 20 * time.Second
	DEFAULT_DISCOVERY_URL = "http://localhost:8888"
)

func Url(defaultUrl string) string {
	return common.Env("DISCOVERY_URL", defaultUrl)
}
func AsClientDiscovery(r gin.IRoutes, info *HeartbeatConfig) {
	Heartbeat(info)
}

func Heartbeat(info *HeartbeatConfig) {
	fmt.Printf("[HEARTBEAT] Use public IP: %v \n", info.Url)
	url := Url(info.DefaultDiscovery)
	request := Endpoint{
		Service:    info.Service,
		Expiration: info.Expiration,
		Url:        info.Url,
	}
	go func() {
		for {
			_, err := resty.R().SetBody(request).Post(url + "/endpoints")
			if err != nil {
				fmt.Printf("[HEARTBEAT] %v \n", err)
			}
			time.Sleep(info.Timeout)
		}
	}()
}

func DefaultHeartBeatConfig(service string, url string) *HeartbeatConfig {
	return &HeartbeatConfig{
		Service:          service,
		Url:              url,
		Expiration:       DEFAULT_EXPIRATION,
		Timeout:          HEARTBEAT_TIMEOUT,
		DefaultDiscovery: DEFAULT_DISCOVERY_URL,
	}
}
