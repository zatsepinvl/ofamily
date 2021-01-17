package service

import (
	"gitlab.com/ofamily/service-tree/mongo"
	common "gitlab.com/ofamily/common-go"
	"gitlab.com/ofamily/service-tree/models"
	"time"
	"gitlab.com/ofamily/common-go/balancer"
	"gopkg.in/resty.v1"
	"fmt"
	"strings"
)

func HandleOnAccountSignup(account *models.Account) {
	s := mongo.Session.Clone()
	defer s.Close()
	db := s.DB(mongo.DialInfo.Database)
	trees := db.C(models.TREES_PUBLIC_NAME)
	persons := db.C(models.PERSONS_PUBLIC_NAME)
	tree, err := CreateTreeWithAccount(account, trees)
	common.Safe(err)
	person := &models.Person{
		FirstName: account.FirstName,
		LastName:  account.LastName,
		Gender:    account.Gender,
		TreeId:    tree.Id.Hex(),
		Birthday:  time.Now(),
	}
	_, err = CreatePerson(person, persons)
	common.Safe(err)
}

func GetAccounts(ids []string) ([]models.Account, error) {
	accountServiceUrl := balancer.BestGateway("service-account")
	request := fmt.Sprintf(
		"http://%s/accounts?ids=%s",
		accountServiceUrl,
		strings.Join(ids, ","),
	)
	response, err := resty.R().
		SetResult([]models.Account{}).
		Get(request)
	if err != nil {
		return nil, err
	}
	return *response.Result().(*[]models.Account), nil
}
