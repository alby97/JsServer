const Router = require('express').Router

const getLessonsChanges = (request, response) => {
    request.database.query('SELECT * FROM lessons_changes WHERE course_name = $1 AND course_type = $2', [response.locals.decodedToken.course_study, response.locals.decodedToken.course_type], (error, result) => {
        if(error) {
            response.status(500).json({"message" : "L'operazione non può essere eseguita."})
        }
        else {
            console.log(result.rows)
            response.status(200).send(result.rows)
        }
    })
}

module.exports = Router().get('/home/getLessonsChanges', getLessonsChanges);