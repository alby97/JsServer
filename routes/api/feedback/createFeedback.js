const Router = require('express').Router

const createFeedback = (request, response) => {
    var title = request.body["title"]
    var description = request.body["description"]
    console.log(title, description)
    var timestamp = new Date().toLocaleString()
    var username = response.locals.decodedToken.username
    // eslint-disable-next-line no-unused-vars
    request.database.query('INSERT INTO feedbacks (title, description, timestamp, username) VALUES ($1, $2, $3, $4)', [title, description, timestamp, username], (error, result) => {
        if(error) {
            console.log(error)
            response.status(500).send()
        }
        else {
            response.status(201).send()
        }
    })
}

module.exports = Router().post('/home/createFeedback', createFeedback)