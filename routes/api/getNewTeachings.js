const Router = require('express').Router
const underscore = require('underscore');

const getNewTeachings = (request, response) => {
    var {
        course_name, course_type
    } = request.body
    request.database.query('SELECT teachings FROM courses WHERE course_name = $1 and course_type = $2', [course_name, course_type], (error, result) => {
        if(error) {
            console.error(error);
            response.status(500).send();
        }
        else {
            //var userYear = response.locals.decodedToken.academic_year
            var year = new Date().getFullYear()
            var arrTeachs = underscore.filter(result.rows[0]["teachings"], (teaching) => {
                return teaching["A.A. OFF.F"] == year.toString()
            })
            console.log(arrTeachs)
            response.status(201).send(arrTeachs)
            
        }
    })
}
module.exports = Router().post('/home/getAllTeachingsLessonChanges', getNewTeachings)