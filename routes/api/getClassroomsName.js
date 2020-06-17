const Router = require('express')

const getClassroomsName = (request, response) => {
    request.database.query("SELECT name FROM classrooms", [], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            console.log(result.rows);
            
            response.status(200).send(result.rows);
        }
    })
}

module.exports = Router().get("/home/getClassroomsName", getClassroomsName)