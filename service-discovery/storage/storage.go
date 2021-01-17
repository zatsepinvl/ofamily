package storage

import (
	"fmt"
	"github.com/go-redis/redis"
	"os"
)

var (
	Redis    *redis.Client
	RedisUrl string
)

const (
	DEFAULT_REDIS_URL = "192.168.99.100:6379"
)

func Connect() {
	RedisUrl = os.Getenv("REDIS_URL")
	if len(RedisUrl) == 0 {
		RedisUrl = DEFAULT_REDIS_URL
	}
	client := redis.NewClient(&redis.Options{
		Addr:     RedisUrl,
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	_, err := client.Ping().Result()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Connected to redis: %s \n", RedisUrl)
	Redis = client
}