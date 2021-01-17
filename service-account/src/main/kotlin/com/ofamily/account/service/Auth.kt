package com.ofamily.account.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.Filters.eq
import org.bson.types.ObjectId
import org.mindrot.jbcrypt.BCrypt
import java.util.*
import java.util.Optional.empty
import java.util.Optional.of

const val SECRET = "o`family_secret"
const val TOKEN_NAME = "JWTOKEN"
val algorithm = Algorithm.HMAC256(SECRET)!!

fun createJwt(account: Account): String =
        JWT.create()
                .withClaim("id", account.id)
                .withClaim("email", account.email)
                .sign(algorithm)


fun createJwt(): String =
        JWT.create()
                .sign(algorithm)

fun getAccount(jwt: DecodedJWT, db: MongoDatabase): Optional<Account> =
        of(readAccounts(db))
                .filter { !jwt.getClaim("id").isNull }
                .map { it.find(eq("_id", ObjectId(jwt.getClaim("id").asString()))) }
                .map { it.first() }

fun login(account: Account, db: MongoDatabase): Optional<Account> =
        of(readAccounts(db))
                .map { it.find(eq("email", account.email)) }
                .map { it.first() }
                .filter { BCrypt.checkpw(account.password, it.password) }

fun setCookie(token: String) = "$TOKEN_NAME=$token; HttpOnly; Path=/"

fun decode(token: String): Optional<DecodedJWT> {
    return try {
        of(
                JWT.require(algorithm)
                        .build()
                        .verify(token)
        )
    } catch (exception: Exception) {
        empty()
    }
}


