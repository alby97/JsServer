
//const express = require('express')
const Router = require('express').Router
const jwt = require('jsonwebtoken')

//var decodedToken = '';

/**
 *This method verify the token that will be sent
 in the request header. If it will be succefful
 then the @param authData will be assigned to
 decodedToken
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
function verifyToken(request, response, next) {
    console.log('Verifica')
    //console.log(request.headers)
    const header = request.headers['authorization'];
    if (typeof header !== 'undefined') {
        const token = header
        jwt.verify(token, request.publicKey, {
            algorithm: ['RS256']
        }, (error, authData) => {
            console.log("Decode");
            console.log(jwt.decode(token));
            
            
            if (error) {
                console.log("Errore, verifica")
                console.log(token)
                response.status(403).json({
                    message: 'Richiesta non autorizzata'
                })
            } else {
                if (authData) {
                    //decodedToken = authData;
                    console.log("AuthData");
                    
                    console.log(authData);
                    
                    response.locals.decodedToken = authData
                    next();
                } else {
                    response.status(400).json({
                        message: 'Nessun dato, c\'è un errore'
                    })
                }
            }
        })
    }
}

module.exports = Router().use('/home', verifyToken)