package main

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/ofamily/common-go/balancer"
	"gitlab.com/ofamily/common-go/discovery"
	"gitlab.com/ofamily/common-go/topology"
	common "gitlab.com/ofamily/common-go"
	"fmt"
	"net/http"
	"os"
	"log"
	"crypto/sha256"
	"io"
)

const (
	SERVICE_NAME      = "service-static"
	DEFAULT_PORT      = "8003"
	DEFAULT_ROOT_PATH = "static"
)

var (
	port = common.Port(DEFAULT_PORT)
	url  = common.Ip() + ":" + port
	path = common.Env("STATIC_PATH", DEFAULT_ROOT_PATH)
)

type FileResponse struct {
	File string `json:"file"`
}

func init() {
	fmt.Println("STATIC_PATH: " + path)
	err := os.MkdirAll(path, os.ModePerm)
	if err != nil {
		panic(err)
	}
}

func main() {
	router := gin.Default()

	balancer.AsPingable(router)
	discovery.AsClientDiscovery(router, discovery.DefaultHeartBeatConfig(SERVICE_NAME, url))
	topology.AsTopologyEntry(router, topologyEntry())

	api := router.Group("/")
	{
		api.Static("/files", path)
		api.POST("/files", func(c *gin.Context) {
			// single file
			file, err := c.FormFile("file")
			common.SafeC(err, c)

			h := sha256.New()
			src, err := file.Open()
			if err != nil {
				common.SafeC(err, c)
			}
			defer src.Close()
			if _, err := io.Copy(h, src); err != nil {
				log.Fatal(err)
			}

			hashStr := fmt.Sprintf("%x", h.Sum(nil))
			err = c.SaveUploadedFile(file, fmt.Sprintf("%v/%v", path, hashStr))
			common.SafeC(err, c)

			c.JSON(http.StatusOK, []string{
				fmt.Sprintf("/files/%v", hashStr),
			})
		})
	}
	router.Run("0.0.0.0:" + port)
}

func topologyEntry() *topology.Entry {
	return &topology.Entry{
		Service: SERVICE_NAME,
		Url:     url,
		Type:    topology.SERVICE,
	}
}
