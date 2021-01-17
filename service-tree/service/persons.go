package service

import (
	"gitlab.com/ofamily/service-tree/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func GetPersonsByTree(tree *models.Tree, persons *mgo.Collection) ([]models.Person, error) {
	treePersons := make([]models.Person, 0)
	err := persons.Find(bson.M{"treeId": tree.Id.Hex()}).All(&treePersons)
	if err != nil {
		return nil, err
	}
	return treePersons, err
}

func GetPersonById(id bson.ObjectId, persons *mgo.Collection) (*models.Person, error) {
	person := &models.Person{}
	err := persons.FindId(id).One(person)
	return person, err
}

func CreatePerson(person *models.Person, persons *mgo.Collection) (*models.Person, error) {
	person.Id = bson.NewObjectId()
	err := persons.Insert(person)
	if err != nil {
		return nil, err
	}
	return person, err
}

func UpdateNode(person *models.Person, persons *mgo.Collection) (*models.Person, error) {
	_, err := persons.FindId(person.Id).Apply(
		mgo.Change{
			Update:    bson.M{"$set": person},
			ReturnNew: true,
			Upsert:    false,
		},
		&person,
	)
	return person, err
}

func DeletePerson(id bson.ObjectId, persons *mgo.Collection) error {
	persons.Find(bson.M{"parents": id.Hex()}).Apply(
		mgo.Change{
			Update:    bson.M{"$pull": bson.M{"parents": id.Hex()}},
			ReturnNew: false,
			Upsert:    false,
		},
		nil,
	)
	err := persons.RemoveId(id)
	return err
}
