const Router = require('express').Router

const removeUserInterest = (request, response) => {
    var interest = request.body["interest"]
    request.database.query('UPDATE users SET interests = array_remove(interests, $1::character varying) WHERE username = $2', [interest, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            response.status(201).send()
        }
    })
}

module.exports = Router().post('/home/removeUserInterest', removeUserInterest)