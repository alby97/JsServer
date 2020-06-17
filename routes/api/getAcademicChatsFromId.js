const Router = require('express').Router


const getAcademicChatsFromId = (request, response) => {
    var chats = JSON.parse(request.body["chats"]);
    // eslint-disable-next-line no-unused-vars
    chats = chats.map((id, index) =>  id);
    console.log(chats)
    request.database.query("SELECT * FROM academic_chats WHERE id = ANY($1::int[])", [chats], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            console.log(result.rows)
            response.status(201).send(result.rows)
        }
    })
}

module.exports = Router().post("/home/getAcademicChatsFromId", getAcademicChatsFromId)