const Router = require('express').Router

const updateSurname = (request, response) => {
    console.log(request.body);
    var surname = request.body["surname"]
    console.log(surname);
    request.database.query("UPDATE users SET surname = $1 WHERE username = $2", [surname, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error);
            response.status(500).send("Errore")
        }
        else {
            response.status(201).send();
        }
    })
}


module.exports = Router().put("/home/profile/updateSurname", updateSurname)