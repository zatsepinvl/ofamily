package service

import (
	"gitlab.com/ofamily/service-tree/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func CreateTreeWithAccount(account *models.Account, trees *mgo.Collection) (*models.Tree, error) {
	tree := &models.Tree{
		Id:       bson.NewObjectId(),
		Name:     account.LastName + " Family",
		Accounts: []string{account.Id},
	}
	err := trees.Insert(tree)
	if err != nil {
		return nil, err
	}
	return tree, err
}
