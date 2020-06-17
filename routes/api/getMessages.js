const Router = require("express").Router

const getMessages = (request, response) => {
    var chatId = request.body["chat_id"]
    request.database.query("SELECT * FROM messages WHERE id_chat = $1 ORDER BY timestamp DESC ", [chatId], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }else {
            response.status(201).send(result.rows)
        }
    })
    /*
    request.database.query("SELECT messages FROM chats WHERE title = $1", [request.body["chatName"]], (error, result) => {
        if(error){
            console.error(error)
            response.status(500).json({
                message : "Errore, riprovare"
            })
        }
        else {
            console.log(result.rows)
            response.status(201).send(result.rows[0])
        }
    })
    */
}

module.exports = Router().post("/home/getMessages", getMessages)