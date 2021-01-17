package com.ofamily.account.service

import com.fasterxml.jackson.annotation.JsonValue
import org.springframework.web.reactive.function.BodyInserters.fromObject
import org.springframework.web.reactive.function.server.*
import org.springframework.web.reactive.function.server.ServerResponse.ok


enum class TopologyEntryType {
    SERVICE,
    STORAGE;

    @JsonValue
    fun getName() = name.toLowerCase()
}

data class TopologyEntry(
        val service: String,
        val url: String,
        val type: TopologyEntryType,
        var connections: List<TopologyEntry>? = null
)

fun RouterFunction<ServerResponse>.asTopologyEntry(entry: TopologyEntry): RouterFunction<ServerResponse> {
    return and(router { topology(entry) })
}

private fun RouterFunctionDsl.topology(entry: TopologyEntry) =
        GET("/topology", {
            ok().body(fromObject(entry))
        })
