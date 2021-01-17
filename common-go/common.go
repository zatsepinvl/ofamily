package common_go

import (
	"os"
	"strconv"
	"fmt"
	"net"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Env(name string, def string) string {
	env := os.Getenv(name)
	if len(env) == 0 {
		env = def
	}
	return env
}

func PrintEnvs() {
	for _, pair := range os.Environ() {
		fmt.Println(pair)
	}
}

func Port(defPort string) string {
	port := os.Getenv("PORT")
	if len(port) == 0 {
		useRandom := os.Getenv("RANDOM_PORT")
		if len(useRandom) == 0 {
			port = defPort
		} else {
			freePort, err := FreePort()
			Safe(err)
			port = strconv.Itoa(freePort)
		}
	}
	fmt.Printf("Use port: %v \n", port)
	return port
}

func FreePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "localhost:0")
	if err != nil {
		return 0, err
	}

	l, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return 0, err
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port, nil
}

func Ip() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	Safe(err)
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String()
}

func TryNotFound(err error, c *gin.Context) bool {
	if err != nil {
		if err.Error() == "not found" {
			c.JSON(http.StatusNotFound, err.Error())
			return true
		} else {
			SafeC(err, c)
		}
	}
	return false
}

func SafeC(err error, c *gin.Context) bool {
	if err != nil {
		if err.Error() == "not found" {
			c.JSON(http.StatusNotFound, err.Error())
			return true
		} else {
			c.AbortWithError(http.StatusInternalServerError, err)
			panic(err)
		}
	}
	return false
}

func Safe(err error) {
	if err != nil {
		panic(err)
	}
}


