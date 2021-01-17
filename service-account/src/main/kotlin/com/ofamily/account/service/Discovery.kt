package com.ofamily.account.service

import kotlinx.coroutines.experimental.delay
import kotlinx.coroutines.experimental.launch
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters.fromObject
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctionDsl
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.router
import java.net.InetAddress
import java.time.Duration

data class HeartbeatConfig(
        val service: String,
        val url: String,
        val expiration: Long = 60,
        val delay: Long = 20L * 1000,
        val discovery: String,
        val timeout: Long = 10L * 1000
)

fun RouterFunction<ServerResponse>.asDiscoveryClient(config: HeartbeatConfig)
        : RouterFunction<ServerResponse> {
    launch {
        val request = toRequest(config)
        while (true) {
            try {
                check(config, request)
            } catch (ex: Throwable) {
                log.warn("[HEARTBEAT] ${ex.message}")
            }
            delay(config.delay)
        }
    }
    return and(router { ping() })
}

private fun RouterFunctionDsl.ping() =
        GET("/ping", {
            ServerResponse.ok().body(fromObject("pong"))
        })


suspend private fun check(config: HeartbeatConfig, request: HeartbeatRequest) {
    WebClient.create(config.discovery)
            .post()
            .uri("/endpoints")
            .accept(MediaType.APPLICATION_JSON)
            .body(fromObject(request))
            .exchange()
            .block(Duration.ofMillis(config.timeout))
}

private class HeartbeatRequest {
    lateinit var service: String
    lateinit var url: String
    var expiration: Long = 0
}

private fun toRequest(config: HeartbeatConfig): HeartbeatRequest =
        HeartbeatRequest()
                .apply {
                    service = config.service
                    url = config.url
                    expiration = config.expiration
                }

