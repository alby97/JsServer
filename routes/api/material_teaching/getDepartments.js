const Router = require('express').Router

/**
 *@returns the list of departments.
 *
 * @param {*} request
 * @param {*} response
 */
const getDepartments = (request, response) => {
    request.database.query("SELECT department FROM deps", (error, result) => {
        if (error) {
            console.log(error)
            response.status(400).json({
                'message': 'Errore.'
            })
        } else {
            console.log(result.rows)
            var dep = []
            for (var i in result.rows) {
                dep.push(result.rows[i]['department'])
            }
            response.status(200).send(dep)
        }
    })


}


module.exports = Router({mergeParams : true}).get('/home/materialTeaching/departments', getDepartments)