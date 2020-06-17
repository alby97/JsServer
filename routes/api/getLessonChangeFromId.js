const Router = require('express').Router

const getLessonChangeFromId = (request, response) => {
    var id = request.body['id']
    request.database.query('SELECT * FROM lessons_changes WHERE id = $1', [id], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send();
        }
        else{
            console.log(result.rows[0]);
            response.status(200).send(result.rows[0])
        }
    })
}


module.exports = Router().post('/home/getLessonChangeFromId', getLessonChangeFromId)