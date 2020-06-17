const Router = require('express').Router

const getChats = (request, response) => {
    var categoryName = request.body['categoryName']
    request.database.query("SELECT title, id_chat FROM chats WHERE category = $1", [categoryName], (error, result) => {
        if (error) {
            console.error(error)
            response.status(400).json({
                message: 'Errore, riprovare'
            })
        } else {
            console.log(result.rows)
            response.status(200).send(result.rows)
            /*
            console.log(result.rows[0])
            var arr = []
            console.log(result.rows[0].chats)
            for (var i in result.rows[0].chats) {
                arr.push(result.rows[0].chats[i])
            }
            response.status(200).send(arr)
            */
        }
    })
}

module.exports = Router().post("/home/getChats", getChats)