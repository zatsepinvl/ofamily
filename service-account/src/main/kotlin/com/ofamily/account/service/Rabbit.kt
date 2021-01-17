package com.ofamily.account.service

import com.rabbitmq.client.Channel
import com.rabbitmq.client.ConnectionFactory
import java.nio.charset.StandardCharsets.UTF_8


const val EXCHANGE_NAME = "account"
const val ACCOUNT_SIGNUP_ROUTING_KEY = "account.signup"
const val ACCOUNT_SIGNUP_QUEUE = "account.signup_queue"

fun connectToRabbitMq(uri: String): Channel {
    val factory = ConnectionFactory()
    factory.setUri(uri)
    val conn = factory.newConnection()
    val channel = conn.createChannel()
    channel.exchangeDeclare(EXCHANGE_NAME, "topic", true)
    channel.queueDeclare(ACCOUNT_SIGNUP_QUEUE, true, false, false, null).queue
    channel.queueBind(ACCOUNT_SIGNUP_QUEUE, EXCHANGE_NAME, ACCOUNT_SIGNUP_ROUTING_KEY)
    return channel
}

fun publishSignup(channel: Channel, message: String) {
    channel.basicPublish(EXCHANGE_NAME, ACCOUNT_SIGNUP_ROUTING_KEY, null, message.toByteArray(UTF_8))
}