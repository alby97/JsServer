const Router = require('express').Router

const getTeachingsToNotify = (request, response) => {
    request.database.query('SELECT teachings_to_notify FROM users WHERE username = $1', [response.locals.decodedToken.username], (error, result) => {
        if(error){
            console.log(error)
            response.status(400).json({'message' : 'Errore nella richiesta'})
        }
        else {
            console.log(result.rows[0])
           /* var teachings = result.rows[0]['teachings_to_notify'][0]
            console.log(JSON.parse(teachings))
            
            response.status(200).send(JSON.parse(teachings))
            */
           response.status(200).send(result.rows[0])
        }
    })
}


module.exports = Router({mergeParams : true}).get('/home/getTeachingsToNotify', getTeachingsToNotify)