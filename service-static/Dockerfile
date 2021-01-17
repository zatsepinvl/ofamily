FROM golang:1.9

ENV GIN_MODE=release
ENV DISCOVERY_URL=http://localhost:8888

WORKDIR /go/src/gitlab.com/ofamily/service-static
COPY . ./

RUN go-wrapper download
RUN go-wrapper install

CMD ["go-wrapper", "run"]

EXPOSE 8003