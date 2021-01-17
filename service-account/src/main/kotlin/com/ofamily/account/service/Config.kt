package com.ofamily.account.service

import org.slf4j.LoggerFactory
import java.net.InetAddress

const val SERVICE_NAME = "service-account"

const val PORT_ENV = "PORT"
const val DEFAULT_PORT = "8001"

const val MONGO_DB_URL_ENV = "MONGO_DB_URI"
const val DEFAULT_MONGO_URI = "mongodb://192.168.99.100:27011/ofamily"

const val DISCOVERY_URL_ENV = "DISCOVERY_URI"
const val DEFAULT_DISCOVERY_URI = "http://localhost:8888"

const val RABBITMQ_URL_ENV = "RABBITMQ_URI"
const val DEFAULT_RABBITMQ_URI = "amqp://rabbitmq:rabbitmq@192.168.99.100:5672/ofamily"

fun ip(): String {
    return InetAddress.getLocalHost().hostAddress
}

fun exposeEnvs() {
    val format = { a: String, b: String -> "\n$a=$b" }
    println(
            format(PORT_ENV, port.toString())
                    + format("PUBLIC_URL", ip())
                    + format(MONGO_DB_URL_ENV, mongoUri)
                    + format(DISCOVERY_URL_ENV, discoveryUri)
                    + format(RABBITMQ_URL_ENV, rabbitmqUri)

    )
}

fun env(env: String, default: String) = System.getenv(env) ?: default

val log = LoggerFactory.getLogger("accounts-service")!!
val port = env(PORT_ENV, DEFAULT_PORT).toInt()
val mongoUri = env(MONGO_DB_URL_ENV, DEFAULT_MONGO_URI)
val discoveryUri = env(DISCOVERY_URL_ENV, DEFAULT_DISCOVERY_URI)
val rabbitmqUri = env(RABBITMQ_URL_ENV, DEFAULT_RABBITMQ_URI)
val serviceName = SERVICE_NAME
val url = ip() + ":" + port
