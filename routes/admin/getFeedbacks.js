const Router = require('express').Router

const getFeedbacks = (request, response) => {
    request.database.query('SELECT * FROM feedbacks',[], (error, result) => {
        if(error) {
            response.status(500).send()
        }
        else {
            response.status(200).send(result.rows)
        }
    })
}

module.exports = Router().get('/adminHome/getFeedbacks', getFeedbacks)