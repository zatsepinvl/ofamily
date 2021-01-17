package com.ofamily.account.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Updates.combine
import com.mongodb.client.model.Updates.set
import com.ofamily.account.service.TopologyEntryType.SERVICE
import com.ofamily.account.service.TopologyEntryType.STORAGE
import com.rabbitmq.client.Channel
import org.bson.types.ObjectId
import org.mindrot.jbcrypt.BCrypt
import org.springframework.http.HttpCookie
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.server.reactive.ReactorHttpHandlerAdapter
import org.springframework.web.reactive.function.BodyInserters.fromObject
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctions.toHttpHandler
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.ServerResponse.*
import org.springframework.web.reactive.function.server.router
import reactor.core.publisher.Mono
import reactor.ipc.netty.http.server.HttpServer
import java.util.Optional.ofNullable

fun main(args: Array<String>) {
    exposeEnvs()
    val database = connectToMongo(mongoUri)
    val channel = connectToRabbitMq(rabbitmqUri)
    val router = router(database, channel)
            .asDiscoveryClient(heartbeatConfig())
            .asTopologyEntry(topologyEntry())
    startServer(port, router)
}


fun topologyEntry() = TopologyEntry(
        service = serviceName,
        url = url,
        type = SERVICE,
        connections = listOf(TopologyEntry(
                service = "mongo-account",
                url = mongoUri,
                type = STORAGE
        ))
)

fun heartbeatConfig() = HeartbeatConfig(
        service = serviceName,
        url = url,
        discovery = discoveryUri
)

fun router(db: MongoDatabase, channel: Channel) = router {
    val objectMapper = ObjectMapper()
    accept(APPLICATION_JSON).nest {

        GET("/accounts", { req ->
            req.queryParam("ids")
                    .filter(String::isNotEmpty)
                    .map { it.split(",") }
                    .map { it.filter(String::isNotEmpty).map { ObjectId(it) } }
                    .map { readAccounts(db).find(Filters.`in`("_id", it)) }
                    .map { ok().body(fromObject(it)) }
                    .orElse(notFound().build())
        })

        GET("/accounts/{id}", { req ->
            ofNullable(req.pathVariable("id"))
                    .map { ObjectId(it) }
                    .map { readAccounts(db).find(eq("_id", it)).first() }
                    .map { ok().body(fromObject(it)) }
                    .orElse(notFound().build())
        })

        PUT("/accounts/{id}", { req ->
            ofNullable(req.bodyToMono(Account::class.java).block())
                    .map { it.id = req.pathVariable("id"); it }
                    .filter { !it.id.isEmpty() }
                    .map {
                        val options = FindOneAndUpdateOptions()
                                .returnDocument(ReturnDocument.AFTER)
                        writeAccounts(db).findOneAndUpdate(
                                eq("_id", it.objectId),
                                combine(
                                        set("firstName", it.firstName),
                                        set("lastName", it.lastName),
                                        set("image", it.accountImage),
                                        set("email", it.email),
                                        set("gender", it.gender)
                                ),
                                options
                        )
                    }
                    .map { ok().body(fromObject(it)) }
                    .orElse(notFound().build())
        })

        POST("/signup", { req ->
            req.bodyToMono(Account::class.java)
                    .map {
                        it.apply {
                            objectId = ObjectId.get()
                            password = BCrypt.hashpw(it.password, BCrypt.gensalt())
                        }
                    }
                    .map {
                        writeAccounts(db).insertOne(it)
                        publishSignup(channel, objectMapper.writeValueAsString(it))
                    }
                    .flatMap { ok().build() }
        })

        POST("/login/jwt", { req ->
            val token = req.cookies().getFirst(TOKEN_NAME)
            loginByJwt(token, db)
        })

        POST("/login", { req ->
            loginByCredentials(req, db)
        })

        POST("/logout", { req ->
            ok()
                    .header("Set-Cookie", setCookie(createJwt()))
                    .build()
        })
    }
}

fun loginByJwt(token: HttpCookie?, db: MongoDatabase): Mono<ServerResponse> =
        ofNullable(token)
                .map(HttpCookie::getValue)
                .flatMap { decode(it) }
                .flatMap { getAccount(it, db) }
                .map { ok().body(fromObject(it)) }
                .orElse(status(UNAUTHORIZED).body(fromObject("Invalid JWT token")))


fun loginByCredentials(req: ServerRequest, db: MongoDatabase): Mono<ServerResponse> =
        ofNullable(req.bodyToMono(Account::class.java).block())
                .flatMap { login(it, db) }
                .map {
                    ok()
                            .header("Set-Cookie", setCookie(createJwt(it)))
                            .body(fromObject(it))
                }
                .orElse(status(UNAUTHORIZED).body(fromObject("Invalid email or password")))

fun startServer(port: Int, router: RouterFunction<in ServerResponse>) {
    val adapter = ReactorHttpHandlerAdapter(toHttpHandler(router))
    HttpServer
            .create(port)
            .newHandler(adapter)
            .block()
    Thread.currentThread().join()
}


