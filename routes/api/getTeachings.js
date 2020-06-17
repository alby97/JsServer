const underscore = require('underscore')
const Router = require('express').Router

const getTeachings = (request, response) => {
    var anno = response.locals.decodedToken.academic_year.substring(0, 4)
    console.log(anno)
    var res = []
    var userCourse = response.locals.decodedToken.course_study
    var userTypeCourse = response.locals.decodedToken.course_type
    var userAddressCourse = response.locals.decodedToken.course_address
    console.log(userCourse + ", " + userTypeCourse )
    request.database.query("SELECT teachings FROM courses WHERE course_name = $1 AND course_type = $2", [userCourse, userTypeCourse], (error, result) => {
        if (error) {
            console.log(error)
            response.status(400).json({
                message: "Errore."
            })
        } else {
            console.log(result.rows[0])
            res = underscore.filter(result.rows[0]['teachings'], function (insegnamento) {
                if (insegnamento["A.A. OFF.F"] == anno && insegnamento["DES IND"] == userAddressCourse) {
                    return insegnamento;
                }
            })
            console.log(res)
            response.status(200).send(res);
        }
    })
}


module.exports = Router().get('/home/getTeachings', getTeachings)