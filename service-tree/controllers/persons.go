package controllers

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/ofamily/service-tree/models"
	common "gitlab.com/ofamily/common-go"
	"net/http"
	"gitlab.com/ofamily/service-tree/service"
	"gopkg.in/mgo.v2/bson"
	"gopkg.in/mgo.v2"
)

func PersonGET(c *gin.Context) {
	personId := bson.ObjectIdHex(c.Param("id"))
	person, err := service.GetPersonById(personId, getPersons(c))
	common.SafeC(err, c)
	c.JSON(http.StatusOK, person)
}

func PersonPOST(c *gin.Context) {
	person := &models.Person{}
	err := c.Bind(person)
	common.SafeC(err, c)

	person, err = service.CreatePerson(person, getPersons(c))
	common.SafeC(err, c)

	c.JSON(http.StatusCreated, person)
}

func PersonPUT(c *gin.Context) {
	person := &models.Person{}
	err := c.Bind(person)
	common.SafeC(err, c)

	person.Id = bson.ObjectIdHex(c.Param("id"))
	person, err = service.UpdateNode(person, getPersons(c))
	common.SafeC(err, c)

	c.JSON(http.StatusOK, person)
}

func PersonDELETE(c *gin.Context) {
	persons := Collection(c, models.PERSONS_PUBLIC_NAME)
	personId := bson.ObjectIdHex(c.Param("id"))
	err := service.DeletePerson(personId, persons)
	common.SafeC(err, c)
	c.Status(http.StatusNoContent)
}

func PersonsByTreePOST(c *gin.Context) {
	persons := []models.Person{}
	err := c.Bind(&persons)
	common.SafeC(err, c)
	treeId := c.Param("id")
	personsCollection := Collection(c, models.PERSONS_PUBLIC_NAME)
	for _, person := range persons {
		person.Id = bson.NewObjectId()
		person.TreeId = treeId
		err = personsCollection.Insert(person)
		common.SafeC(err, c)
	}
	c.Status(200)
}


func getPersons(c *gin.Context) *mgo.Collection {
	return Collection(c, models.PERSONS_PUBLIC_NAME)
}

