package models

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

const (
	TREES_PUBLIC_NAME   = "trees"
	PERSONS_PUBLIC_NAME = "persons"
)

type Tree struct {
	Id       bson.ObjectId `json:"id" bson:"_id"`
	Name     string `json:"name" bson:"name"`
	Accounts []string `json:"accounts" bson:"accounts"`
}

type Person struct {
	Id           bson.ObjectId `json:"id"  bson:"_id"`
	TreeId       string `json:"treeId" bson:"treeId"`
	Parents      []string `json:"parents" bson:"parents"`
	Pair         string `json:"pair" bson:"pair"`
	FirstName    string `json:"firstName" bson:"firstName"`
	LastName     string `json:"lastName" bson:"lastName"`
	Birthday     time.Time `json:"birthday" bson:"birthday"`
	Biography    string `json:"biography" bson:"biography"`
	PersonImage  string `json:"personImage" bson:"personImage"`
	ProfileImage string `json:"profileImage" bson:"profileImage"`
	Gender       string `json:"gender" bson:"gender"`
}

type Account struct {
	Id        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Gender    string `json:"gender"`
}
