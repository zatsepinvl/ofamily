FROM golang:1.9

ENV GIN_MODE=release

WORKDIR /go/src/gitlab.com/ofamily/service-gateway

COPY . ./

RUN go-wrapper download
RUN go-wrapper install

CMD ["go-wrapper", "run"]

EXPOSE 8000