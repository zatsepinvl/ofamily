package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/go-redis/redis"
	"time"
	common "gitlab.com/ofamily/common-go"
	"gitlab.com/ofamily/common-go/balancer"
	"gitlab.com/ofamily/common-go/discovery"
	"gitlab.com/ofamily/common-go/topology"
	"gitlab.com/ofamily/service-discovery/storage"
)

const (
	SERVICE_NAME = "service-discovery"
	PORT         = "8888"
	REDIS        = "redis"
)

var (
	port = common.Port(PORT)
	url  = common.Ip() + ":" + port
)

func init() {
	storage.Connect()
}

func main() {
	router := gin.Default()
	balancer.AsPingable(router)
	discovery.AsClientDiscovery(router, heartbeatInfo())
	topology.AsTopologyEntry(router, topologyEntry())
	router.Use(RedisM)
	api := router.Group("/")
	{
		api.GET("/endpoints", endpointsGet)
		api.POST("/endpoints", endpointsPost)
	}
	router.Run("0.0.0.0:" + port)
}

func RedisM(c *gin.Context) {
	c.Set(REDIS, storage.Redis)
	c.Next()
}

func heartbeatInfo() *discovery.HeartbeatConfig {
	return &discovery.HeartbeatConfig{
		Service:          SERVICE_NAME,
		Url:              url,
		Expiration:       discovery.DEFAULT_EXPIRATION,
		Timeout:          discovery.HEARTBEAT_TIMEOUT,
		DefaultDiscovery: "http://" + url,
	}
}

func topologyEntry() *topology.Entry {
	return &topology.Entry{
		Service: SERVICE_NAME,
		Url:     url,
		Type:    topology.SERVICE,
		Connections: []topology.Entry{
			{
				Service: "redis-db",
				Url:     storage.RedisUrl,
				Type:    topology.STORAGE,
			},
		},
	}
}

func redisClient(c *gin.Context) *redis.Client {
	return c.MustGet(REDIS).(*redis.Client)
}

func endpointsGet(c *gin.Context) {
	client := redisClient(c)
	keys, err := client.Keys("*").Result()
	common.SafeC(err, c)
	endpoints := make(map[string][]string)
	for _, v := range keys {
		key, err := client.Get(v).Result()
		common.SafeC(err, c)
		endpoints[key] = append(endpoints[key], v)
	}
	c.JSON(http.StatusOK, endpoints)
}

func endpointsPost(c *gin.Context) {
	endpoint := discovery.Endpoint{}
	common.SafeC(c.BindJSON(&endpoint), c)
	client := redisClient(c)
	client.Set(endpoint.Url, endpoint.Service, time.Duration(endpoint.Expiration)*time.Second)
	c.JSON(http.StatusOK, endpoint)
}
