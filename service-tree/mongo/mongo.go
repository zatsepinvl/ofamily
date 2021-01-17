package mongo

import (
	"fmt"
	"gopkg.in/mgo.v2"
	common "gitlab.com/ofamily/common-go"
)

var (
	Session  *mgo.Session
	DialInfo *mgo.DialInfo
	Url      string
)

const (
	DEFAULT_MONGO_DB_URL = "192.168.99.100:27017/ofamily"
)

// Connect connects to mongodb
func Connect() {
	Url = common.Env("MONGO_DB_URL", DEFAULT_MONGO_DB_URL)
	dialInfo, err := mgo.ParseURL(Url)
	common.Safe(err)
	s, err := mgo.Dial(Url)
	common.Safe(err)
	s.SetSafe(&mgo.Safe{})
	fmt.Println("Connected to", Url)
	Session = s
	DialInfo = dialInfo
}
