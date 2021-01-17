FROM golang:1.9

ENV GIN_MODE=release
ENV DISCOVERY_URL=http://localhost:8888
ENV MONGO_DB_URL=localhost:27017/ofamily
ENV RABBITMQ_URI=amqp://rabbitmq:rabbitmq@localhost:5672/ofamily

WORKDIR /go/src/gitlab.com/ofamily/service-tree
COPY . ./

RUN go-wrapper download
RUN go-wrapper install

CMD ["go-wrapper", "run"]

EXPOSE 8002