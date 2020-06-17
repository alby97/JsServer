const Router = require('express').Router

const joinChat = (request, response) => {
    console.log("Chat name:" + request.body["chatName"])
    var arr = "{" + request.body["chatName"] + "}";
    request.database.query('UPDATE users SET joined_chats = joined_chats || $1 WHERE username = $2 RETURNING *', [arr, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).json({
                message : "Errore"
            })
        }
        else {
            request.socket.join(request.body["chatName"])
            request.socket.broadcast.emit("new_user", response.locals.decodedToken.username + "si è aggiunto alla chat")
            response.status(201).json({
                message : "Sei entrato/a con successo nella chat."
            })
        }
    })
}

module.exports = Router().post("/home/joinChat", joinChat)