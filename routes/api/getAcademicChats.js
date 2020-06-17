const Router = require('express').Router

const getAcademicChats = (request, response) => {
    var department = request.body["department"]
    request.database.query('SELECT * FROM academic_chats WHERE department = $1', [department], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            response.status(200).send(result.rows)
        }
    })
}

module.exports = Router().post('/home/getAcademicChats', getAcademicChats)