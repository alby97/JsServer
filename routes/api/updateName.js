const Router = require('express').Router

const updateName = (request, response) => {
    console.log(request.body);
    var name = request.body["name"]
    console.log(name);
    request.database.query("UPDATE users SET name = $1 WHERE username = $2", [name, response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error);
            response.status(500).send("Errore")
        }
        else {
            response.status(201).send();
        }
    })
}


module.exports = Router().put("/home/profile/updateName", updateName)