const Router = require('express').Router
const bcrypt = require('bcrypt')
const path = require('path')
const myRender = require('../../render/render')


const resetPassword = (request, response) => {
        var resetToken = request.body['token']
        //console.log(request);
        console.log(request.body);
        console.log(resetToken)
        request.database.query('SELECT * FROM users WHERE reset_password_token = $1', [resetToken], (error, result) => {
            if(error) {
                console.error(error)
                response.status(500).send()
            }
            else {
                var newPassword = request.body['newPassword']
                var verifyPassword = request.body['verifyPassword']
                if(newPassword == verifyPassword) {
                    bcrypt.genSalt(15, (error, salt) => {
                        if(error) {
                            response.status(500).send()
                        }
                        else {
                            bcrypt.hash(newPassword, salt, (error, hash) => {
                                if(error) {
                                    response.status(500).send()
                                }
                                else {
                                    request.database.query('UPDATE users SET password = $1, reset_password_token = $2, reset_password_token_expiration = $3 WHERE username = $4', [hash, null, null, result.rows[0]['username']], (error, result2) => {
                                        if(error) {
                                            response.status(500).send()
                                        }
                                        else {
                                            response.status(200).send()
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    response.status(400).send('Le password non coincidono.')
                }
            }
        })
}


module.exports = Router().post('/public/resetPassword', resetPassword)