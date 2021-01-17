package topology

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type EntryType string

const (
	STORAGE   EntryType = "storage"
	SERVICE             = "service"
	UNDEFINED           = "undefined"
)

type Entry struct {
	Service     string `json:"service" binding:"required"`
	Url         string `json:"url" binding:"required"`
	Type        EntryType `json:"type" binding:"required"`
	Latency     int    `json:"latency"`
	Connections []Entry `json:"connections,omitempty"`
}

func AsTopologyEntry(r gin.IRoutes, entry *Entry) {
	r.GET("/topology", EntryGetC(entry))
}

func AsDynamicTopologyEntry(r gin.IRouter, provider func() *Entry) {
	r.GET("/topology", EntryGetP(provider))
}

func EntryGetC(entry *Entry) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, entry)
	}
}

func EntryGetP(provider func() *Entry) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, provider())
	}
}
