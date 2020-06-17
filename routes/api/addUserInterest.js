const Router = require('express').Router

const addUserInterest = (request, response) => {
    var interest = "{" + request.body["interest"] + "}"
    request.database.query('UPDATE users SET interests = interests || $1 WHERE username = $2', [interest, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            response.status(201).send()
        }
    })
}

module.exports = Router().post('/home/addUserInterest', addUserInterest)