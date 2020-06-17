const Router = require('express').Router
const underscore = require('underscore')


const getCourseAddresses = (request, response) => {
    var {course_name, course_type, course_year} = request.body
    console.log(course_name, course_type, course_year);
    request.database.query('SELECT teachings FROM courses WHERE course_name = $1 AND course_type = $2', [course_name, course_type], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            var arrAddresses = []
            var tmp = underscore.filter(result.rows[0]['teachings'], function (insegnamento) {
                if (insegnamento["A.A. OFF.F"] == course_year.substring(0, 4)) {
                    return insegnamento["DES IND"];
                }
            })
            //console.log(tmp);
            for(var i in tmp) {
                arrAddresses.push(tmp[i]["DES IND"])
            }
            arrAddresses = underscore.uniq(arrAddresses)
            console.log(arrAddresses);
            response.status(201).send(arrAddresses)
        }
    })
}

module.exports = Router().post('/home/getCourseAddresses', getCourseAddresses)