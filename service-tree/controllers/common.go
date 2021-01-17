package controllers

import (
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
)

const (
	DB_CONTEXT_PARAM_NAME = "db"
)

func GetDb(c *gin.Context) *mgo.Database {
	return c.MustGet(DB_CONTEXT_PARAM_NAME).(*mgo.Database)
}

func Collection(c *gin.Context, database string) *mgo.Collection {
	return GetDb(c).C(database)
}
