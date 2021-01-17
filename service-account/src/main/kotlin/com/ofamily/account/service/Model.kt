package com.ofamily.account.service

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonIgnore
import org.bson.types.ObjectId

class Account {
    @BsonId
    @JsonIgnore
    lateinit var objectId: ObjectId

    @set:BsonIgnore
    @get:BsonIgnore
    var id: String
        get() = objectId.toHexString()
        set(id) {
            objectId = ObjectId(id)
        }

    var email: String? = null

    @get:JsonIgnore
    @set:JsonProperty
    var password: String? = null

    var firstName: String? = null
    var lastName: String? = null
    var accountImage: String? = null
    var gender: String? = null
}

