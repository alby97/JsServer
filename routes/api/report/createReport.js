const Router = require('express').Router

const createReport = (request, response) => {
    const title = request.body["title"]
    const description = request.body["description"]
    const type = request.body["type"]
    const materialTeachingId = request.body["material_teaching_id"]
    const timestamp = new Date().toLocaleString()
    const username = response.locals.decodedToken.username
    // eslint-disable-next-line no-unused-vars
    request.database.query("INSERT INTO reports (title, description, type, timestamp, username, material_teaching_id) VALUES ($1, $2, $3, $4, $5, $6)", [title, description, type, timestamp, username, materialTeachingId], (error, result) => {
        if(error) {
            response.status(500).send()
        }
        else {
            response.status(201).send()
        }
    })
}

module.exports = Router().post("/home/createReport", createReport)