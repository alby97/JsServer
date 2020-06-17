const Router = require('express').Router

const getUserInterests = (request, response) => {
    request.database.query('SELECT interests FROM users WHERE username = $1', [response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            console.log(result.rows[0])
            response.status(200).send(result.rows[0]["interests"])
        }
    })
}

module.exports = Router().get('/home/getUserInterests', getUserInterests)