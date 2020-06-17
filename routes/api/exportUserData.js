const Router = require("express").Router
//const fs = require("fs")

const exportUserData = (request, response) => {
    request.database.query("SELECT * FROM users WHERE username = $1", [response.locals.decodedToken.username], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            var htmlData = "<!DOCTYPE html> <html> <body> <h1> Dati utente " + `${result.rows[0]["username"]}` + "  </h1>"
            htmlData += "<h1> Nome: "+ result.rows[0]["name"] +"</h1>"
            htmlData += "<h1> Cognome: "+ result.rows[0]["surname"] +"</h1>"
            htmlData += "<h1> Email: "+ result.rows[0]["email"] + "</h1>"
            htmlData += "<h1> Url immagine di profilo: "+ result.rows[0]["profile_image_path"] +"</h1>"
            htmlData += "<h1> Dipartimento: "+ result.rows[0]["department"] +"</h1>"
            htmlData += "<h1> Corso di studio: "+ result.rows[0]["course_study"] +"</h1>"
            htmlData += "<h1> Tipo di corso di studio: "+ result.rows[0]["course_type"] +"</h1>"
            htmlData += "<h1> Indirizzo del corso di studio: "+ result.rows[0]["course_address"] +"</h1>"
            htmlData += "<h1> Anno di iscrizione: "+ result.rows[0]["academic_year"] +"</h1>"
            htmlData += "<h1> Interessi: "+ result.rows[0]["interests"] +"</h1>"
            htmlData += "</body></html>"
            response.status(200).send(htmlData);
        }
    })
}

module.exports = Router().get("/home/exportUserData", exportUserData)