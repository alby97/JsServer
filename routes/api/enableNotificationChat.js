const Router = require('express').Router

const enableNotificationChat = (request, response) => {
    var chatName = request.body["chatName"]
    request.database.query("UPDATE users SET chats_to_notify = chats_to_notify || $1 WHERE username = $2", [chatName, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            response.status(201).send()
        }
    })
}

module.exports = Router().post("/home/enableNotificationChat", enableNotificationChat)