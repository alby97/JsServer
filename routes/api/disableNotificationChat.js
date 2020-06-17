const Router = require('express').Router

const disableNotificationChat = (request, response) => {
    var chatName = request.body["chatName"]
    request.database.query("UPDATE users SET chats_to_notify = array_remove(chats_to_notify, $1::character varying) WHERE username = $2", [chatName, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            response.status(201).send()
        }
    })
}

module.exports = Router().post("/home/disableNotificationChat", disableNotificationChat)