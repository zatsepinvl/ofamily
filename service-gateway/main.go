package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httputil"
	"net/url"
	"github.com/gin-contrib/cors"
	"gitlab.com/ofamily/common-go/balancer"
	common "gitlab.com/ofamily/common-go"
	"gitlab.com/ofamily/common-go/topology"
)

const (
	DEFAULT_PORT          = "8000"

	SERVICE_ACCOUNT = "service-account"
	SERVICE_TREE    = "service-tree"
	SERVICE_STATIC  = "service-static"
)

var (
	port       = common.Port(DEFAULT_PORT)
	urlAddress = common.Ip() + ":" + port
)

func init() {
	balancer.AsClientLoadBalancer(balancer.DefaultBalanceConfig())
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	balancer.AsPingable(router)
	topology.AsDynamicTopologyEntry(router, topologyEntry)

	api := router.Group("/")
	{
		//service-gateway
		api.Static("ui", "static")
		api.GET("/gateways", gatewaysGET)

		//service-account
		api.POST("/signup", reversedProxy(SERVICE_ACCOUNT))
		api.POST("/login", reversedProxy(SERVICE_ACCOUNT))
		api.POST("/login/jwt", reversedProxy(SERVICE_ACCOUNT))
		api.POST("/logout", reversedProxy(SERVICE_ACCOUNT))
		api.GET("/accounts", reversedProxy(SERVICE_ACCOUNT))
		api.GET("/accounts/:id", reversedProxy(SERVICE_ACCOUNT))
		api.PUT("/accounts/:id", reversedProxy(SERVICE_ACCOUNT))

		//service-tree
		//trees
		api.GET("/accounts/:id/trees", reversedProxy(SERVICE_TREE))
		api.GET("/trees/:id/accounts", reversedProxy(SERVICE_TREE))
		api.POST("/trees", reversedProxy(SERVICE_TREE))
		api.GET("/trees/:id", reversedProxy(SERVICE_TREE))
		api.PUT("/trees/:id", reversedProxy(SERVICE_TREE))
		//persons
		api.GET("/trees/:id/persons", reversedProxy(SERVICE_TREE))
		api.POST("/trees/:id/persons", reversedProxy(SERVICE_TREE))
		api.GET("/persons/:id", reversedProxy(SERVICE_TREE))
		api.POST("/persons", reversedProxy(SERVICE_TREE))
		api.PUT("/persons/:id", reversedProxy(SERVICE_TREE))
		api.DELETE("/persons/:id", reversedProxy(SERVICE_TREE))

		//service-static
		api.GET("/files/*any", reversedProxy(SERVICE_STATIC))
		api.POST("/files", reversedProxy(SERVICE_STATIC))
	}
	router.Run("0.0.0.0:" + port)
}

func topologyEntry() *topology.Entry {
	var gateways *balancer.Gateways
	balancer.ReadGateways(func(g *balancer.Gateways) {
		gateways = g
	})
	return topologyFromGateways(gateways)
}

func gatewaysGET(c *gin.Context) {
	balancer.ReadGateways(func(gateways *balancer.Gateways) {
		c.JSON(http.StatusOK, gateways)
	})
}

func reversedProxy(service string) gin.HandlerFunc {
	return func(c *gin.Context) {
		host := balancer.BestGateway(service)
		if len(host) <= 0 {
			c.JSON(http.StatusBadGateway, "service "+service+" not found")
		}
		httputil.NewSingleHostReverseProxy(&url.URL{
			Scheme: "http",
			Host:   balancer.BestGateway(service),
		}).ServeHTTP(c.Writer, c.Request)
	}
}
