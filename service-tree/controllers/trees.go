package controllers

import (
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	common "gitlab.com/ofamily/common-go"
	"gitlab.com/ofamily/service-tree/models"
	"gitlab.com/ofamily/service-tree/service"
	"gopkg.in/mgo.v2"
)

func TreesByAccountGET(c *gin.Context) {
	treesCollection := Collection(c, models.TREES_PUBLIC_NAME)
	trees := []models.Tree{}
	accountId := c.Param("id")

	err := treesCollection.Find(bson.M{"accounts": accountId}).All(&trees)
	if common.TryNotFound(err, c) {
		return
	}

	c.JSON(200, trees)
}

func PersonsByTreeGET(c *gin.Context) {
	tree := &models.Tree{
		Id: bson.ObjectIdHex(c.Param("id")),
	}
	treeNodes, err := service.GetPersonsByTree(tree, Collection(c, models.PERSONS_PUBLIC_NAME))
	common.SafeC(err, c)
	c.JSON(http.StatusOK, treeNodes)
}

func TreeGET(c *gin.Context) {
	treeId := bson.ObjectIdHex(c.Param("id"))
	trees := Collection(c, models.TREES_PUBLIC_NAME)
	tree := models.Tree{}
	err := trees.FindId(treeId).One(&tree)
	common.SafeC(err, c)
	c.JSON(http.StatusOK, tree)
}

func TreePOST(c *gin.Context) {
	tree := &models.Tree{}
	err := c.Bind(tree)
	common.SafeC(err, c)
	tree.Id = bson.NewObjectId()

	trees := Collection(c, models.TREES_PUBLIC_NAME)
	err = trees.Insert(&tree)
	common.SafeC(err, c)

	c.JSON(http.StatusCreated, tree)
}

func TreePUT(c *gin.Context) {
	tree := models.Tree{}
	err := c.Bind(&tree)
	common.SafeC(err, c)
	trees := Collection(c, models.TREES_PUBLIC_NAME)
	_, err = trees.FindId(tree.Id).Apply(
		mgo.Change{
			Update:    bson.M{"$set": tree},
			ReturnNew: true,
			Upsert:    false,
		},
		&tree,
	)
	common.SafeC(err, c)
	c.JSON(http.StatusOK, tree)
}
