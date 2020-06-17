const Router = require('express').Router

const getAcademicMessages = (request, response) => {
    console.log(request.body)
    var chatId = request.body["chat_id"]
    request.database.query("SELECT * FROM academic_messages WHERE id_chat = $1 ORDER BY timestamp DESC ", [chatId], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }else {
            response.status(201).send(result.rows)
        }
    })
}

module.exports = Router().post('/home/getAcademicMessages', getAcademicMessages)