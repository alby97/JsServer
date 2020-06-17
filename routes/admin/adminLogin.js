const Router = require('express').Router
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const adminLogin = (request, response) => {
    const {username, password} = request.body
    request.database.query('SELECT * FROM admins WHERE username = $1', [username], (error, result) => {
        if(error) {
            response.status(400).send()
        }
        else {
            var encryptedPassword = result.rows[0]['password']
            // eslint-disable-next-line no-unused-vars
            bcrypt.compare(password, encryptedPassword, (error2, result2) => {
                if(error2) {
                    response.status(400).send()
                }
                else {
                    if(result2 != false){
                        response.status(201).json({
                            token: jwt.sign({
                                username: result.rows[0].username,
                                is_admin: 'true'
                            }, request.privateKey, {
                                algorithm: 'RS256',
                                expiresIn: '1h'
                            })
                        })
                    }
                    else {
                        response.status(400).send() //password errata
                    }
                }
            })
        }
    })
}

module.exports = Router().post('/adminLogin', adminLogin)