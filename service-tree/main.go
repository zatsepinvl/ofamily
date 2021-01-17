package main

import (
	"github.com/gin-gonic/gin"
	ctrl "gitlab.com/ofamily/service-tree/controllers"
	"gitlab.com/ofamily/service-tree/mongo"
	"gitlab.com/ofamily/common-go/balancer"
	"gitlab.com/ofamily/common-go/discovery"
	"gitlab.com/ofamily/common-go/topology"
	common "gitlab.com/ofamily/common-go"
	"gitlab.com/ofamily/common-go/rabbit"
	"gitlab.com/ofamily/service-tree/models"
	"encoding/json"
	"gitlab.com/ofamily/service-tree/service"
)

const (
	SERVICE_NAME = "service-tree"
	DEFAULT_PORT = "8002"
)

var (
	port = common.Port(DEFAULT_PORT)
	url  = common.Ip() + ":" + port
)

func init() {
	mongo.Connect()
	balancer.AsClientLoadBalancer(balancer.DefaultBalanceConfig())
	rabbit.ConnectToRabbit(rabbitMqConfig())
}

func main() {
	common.PrintEnvs()
	router := gin.Default()

	balancer.AsPingable(router)
	discovery.AsClientDiscovery(router, discovery.DefaultHeartBeatConfig(SERVICE_NAME, url))
	topology.AsTopologyEntry(router, topologyEntry())

	router.Use(mongoMiddleware)
	api := router.Group("/")
	{
		//trees
		api.GET("/accounts/:id/trees", ctrl.TreesByAccountGET)
		api.GET("/trees/:id/accounts", ctrl.AccountsByTreeGET)
		api.POST("/trees", ctrl.TreePOST)
		api.GET("/trees/:id", ctrl.TreeGET)
		api.PUT("/trees/:id", ctrl.TreePUT)

		//persons
		api.GET("/trees/:id/persons", ctrl.PersonsByTreeGET)
		api.POST("/trees/:id/persons", ctrl.PersonsByTreePOST)
		api.GET("/persons/:id", ctrl.PersonGET)
		api.POST("/persons", ctrl.PersonPOST)
		api.PUT("/persons/:id", ctrl.PersonPUT)
		api.DELETE("/persons/:id", ctrl.PersonDELETE)
	}

	router.Run("0.0.0.0:" + port)
}

func rabbitMqConfig() *rabbit.ConnectionConfig {
	return &rabbit.ConnectionConfig{
		DefaultUri: rabbit.DEFAULT_RABBITMQ_URI,
		Consumers: map[string]func([]byte){
			"account.signup_queue": func(body []byte) {
				account := &models.Account{}
				err := json.Unmarshal(body, account)
				common.Safe(err)
				service.HandleOnAccountSignup(account)
			},
		},
	}
}

func topologyEntry() *topology.Entry {
	return &topology.Entry{
		Service: SERVICE_NAME,
		Url:     url,
		Type:    topology.SERVICE,
		Connections: []topology.Entry{
			{
				Service: "mongodb",
				Url:     mongo.Url,
				Type:    topology.STORAGE,
			},
		},
	}
}

func mongoMiddleware(c *gin.Context) {
	s := mongo.Session.Clone()

	defer s.Close()

	c.Set(ctrl.DB_CONTEXT_PARAM_NAME, s.DB(mongo.DialInfo.Database))
	c.Next()
}
