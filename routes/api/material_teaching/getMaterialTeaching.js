const Router = require('express').Router

//receive the course and retrieve all the files for the specified course of study


const getMaterialTeaching = (request, response) => {
    console.log(request.params)
    var course = request.params.course
    request.database.query('SELECT * FROM material_teaching WHERE course_of_study = $1', [course], (error, result) => {
        console.log(error)
        if(error) {
            response.status(500).send()
        }
        else {
            response.status(200).send(result.rows)
        }
    })
}


module.exports = Router().get('/home/materialTeaching/departments/:department/courses/:course/files', getMaterialTeaching)