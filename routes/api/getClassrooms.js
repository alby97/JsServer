const Router = require('express')

const getClassrooms = (request, response) => {
    request.database.query("SELECT * FROM classrooms", [], (error, result) => {
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

module.exports = Router().get("/home/getClassrooms", getClassrooms)