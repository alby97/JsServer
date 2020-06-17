const Router = require('express').Router

const leaveChat = (request, response) => {
    var chatName = request.body["chatName"]
    console.log(chatName)
    request.database.query('UPDATE users SET joined_chats = array_remove(joined_chats, $1::character varying), chats_to_notify = array_remove(chats_to_notify, $1::character varying) WHERE username = $2', [chatName, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            response.status(201).send()
        }
    })
}

module.exports = Router().post('/home/leaveChat', leaveChat)