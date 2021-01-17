package com.ofamily.account.service

import com.mongodb.*
import com.mongodb.client.MongoDatabase
import org.bson.codecs.configuration.CodecRegistries.fromProviders
import org.bson.codecs.configuration.CodecRegistries.fromRegistries
import org.bson.codecs.pojo.PojoCodecProvider
import reactor.core.publisher.toMono

const val ACCOUNTS_COLLECTION = "accounts"

fun connectToMongo(url: String): MongoDatabase {
    val pojoCodecRegistry = fromRegistries(
            MongoClient.getDefaultCodecRegistry(),
            fromProviders(
                    PojoCodecProvider.builder()
                            .automatic(true)
                            .build()
            )
    )
    val mongoUri = MongoClientURI(
            url,
            MongoClientOptions.builder()
                    .codecRegistry(pojoCodecRegistry)
    )
    val mongoClient = MongoClient(mongoUri)
    return mongoClient.getDatabase(mongoUri.database)
}

private fun accounts(db: MongoDatabase) =
        db.getCollection(ACCOUNTS_COLLECTION, Account::class.java)

fun readAccounts(db: MongoDatabase) =
        accounts(db).withReadConcern(ReadConcern.DEFAULT)!!

fun writeAccounts(db: MongoDatabase) =
        accounts(db).withWriteConcern(WriteConcern.UNACKNOWLEDGED)!!