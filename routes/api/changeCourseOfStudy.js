const Router = require('express').Router

const changeCourseOfStudy = (request, response) => {
    var {
        courseName,
        courseType,
        address,
        year,
        department
    } = request.body
    request.database.query("UPDATE users SET teaches_to_notify = '{}', course_study = $1, department = $2, academic_year = $3, course_type = $4, course_address = $5 WHERE username = $6 RETURNING *", [courseName, department, year, courseType, address, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
        }
        else {
            //!Va rilasciato un nuovo token.
            
            response.status(201).send()
        }
    })
}

module.exports = Router().post('/home/changeCourseOfStudy', changeCourseOfStudy)