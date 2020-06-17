const Router = require('express').Router
const jwt = require('jsonwebtoken')



function verifyAdminToken(request, response, next) {
    const header = request.header['authorization']
    if(typeof header !== 'undefined') {
        const token = header
        jwt.verify(token, request.publicKey, {
            algorithm: ['RS256']
        }, (error, authData)=> {
            if(error) {
                response.status(403).json({
                    message: 'Richiesta non autorizzata'
                })
            }
            else {
                if(authData){
                    if(JSON.parse(authData['is_admin']) == true){
                        response.locals.decodedToken = authData
                        next()
                    }
                    else {
                        response.status(403).send() //non è un admin
                    }

                }
            }
        })
    }
}


module.exports = Router().use('/adminHome', verifyAdminToken)