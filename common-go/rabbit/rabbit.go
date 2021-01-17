package rabbit

import (
	"github.com/streadway/amqp"
	"log"
	"fmt"
	common"gitlab.com/ofamily/common-go"
)

const (
	DEFAULT_RABBITMQ_URI = "amqp://rabbitmq:rabbitmq@192.168.99.100:5672/ofamily"
)

type ConnectionConfig struct {
	DefaultUri string
	Consumers  map[string]func([]byte)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}

func ConnectToRabbit(config *ConnectionConfig) {
	uri := common.Env("RABBITMQ_URI", config.DefaultUri)
	conn, err := amqp.Dial(uri)
	failOnError(err, "Failed to connect to RabbitMQ")
	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	for queue, consumer := range config.Consumers {
		consume(ch, queue, consumer)
	}
}

func consume(ch *amqp.Channel, queue string, consumer func([]byte)) {
	msgs, err := ch.Consume(
		queue,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to register a consumer")
	go func() {
		for d := range msgs {
			consumer(d.Body)
		}
	}()
}
