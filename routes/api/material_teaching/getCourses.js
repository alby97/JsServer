const Router = require('express').Router

/**
 * Returns the courses of the chosen department 
 *
 * @param {*} request -> The body must be the number of the entry of the department
 * @param {*} response
 */
const getCourses = (request, response) => {
    console.log('Corsi')
    //  console.log(request.body)
    //  console.log(request.body['dipartimento'])
    console.log(request.params)
    var department = request.params.department //request.body['dipartimento'];
    request.database.query('SELECT courses_name FROM deps WHERE department = $1', [department], (error, result) => {
        if (error) {
            console.log(error)
            response.status(400).json({
                "message": "Error"
            })
        } else {

            response.status(200).json(result.rows[0]["courses_name"])
        }
    })
    //console.log(courses.toString)
}


module.exports = Router({mergeParams : true}).get('/home/materialTeaching/departments/:department/courses', getCourses)