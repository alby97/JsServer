const Router = require('express').Router

const getCategories = (request, response) => {
    request.database.query("SELECT name FROM CATEGORIES", (error, result) => {
        if(error){
            response.status(500).json({
                message : "Errore del server, riprovare."
            })
        }
        else{
            response.status(200).json({
                categories : result.rows
            })
        }
    })
}

module.exports = Router().get('/home/getCategories', getCategories);