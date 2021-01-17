FROM golang:1.9

ENV GIN_MODE=release
ENV REDIS_URL=localhost:6379

WORKDIR /go/src/gitlab.com/ofamily/service-discovery

COPY . ./

RUN go-wrapper download
RUN go-wrapper install

CMD ["go-wrapper", "run"]

EXPOSE 8888