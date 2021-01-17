package controllers

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/ofamily/service-tree/models"
	"gopkg.in/mgo.v2/bson"
	common "gitlab.com/ofamily/common-go"
	"gitlab.com/ofamily/service-tree/service"
)

func AccountsByTreeGET(c *gin.Context) {
	trees := Collection(c, models.TREES_PUBLIC_NAME)
	tree := models.Tree{}
	treeId := c.Param("id")
	err := trees.FindId(bson.ObjectIdHex(treeId)).One(&tree)
	if common.TryNotFound(err, c) {
		return
	}
	accounts, err := service.GetAccounts(tree.Accounts)
	common.SafeC(err, c)
	c.JSON(200, accounts)
}
