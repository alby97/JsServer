var jwt =  require('jsonwebtoken')
var bcrypt = require('bcrypt')
const Router = require('express').Router


/**
 *This create a user, in the request the user must
 *specify username, email and password
 the rating is set to 0 by default when the
 user is created
 if the username or the email is already taken
 the @returns 400 (error)
 else @returns 201 (the user was successfully created)
 * 
 * @param {*} request
 * @param {*} response
 */
const createUser = (request, response) => {
    console.log("Create User")
    const {
        username,
        email,
        password
    } = request.body
    const rating = 0
    //var salt = bcrypt.genSaltSync()
    bcrypt.genSalt(15, (error, salt) => {
        if(error) {
            console.error(error)
        }
        else {
            console.log("Salt " + salt);
            bcrypt.hash(password, salt, function (error1, hash) {
                if (error1) {
                    console.log(error1)
                } else {
                    request.database.query('INSERT INTO users (username, email, password, rating) VALUES ($1, $2, $3, $4)', [username, email, hash, rating], (error, results) => {
                        if (error) {
                            response.status(400).send('Username o email già esistenti')
                        } else {
                            response.status(201).json({
                                token: jwt.sign({
                                    username: username,
                                    email: email,
                                }, request.privateKey, {
                                    algorithm: 'RS256'
                                }, {
                                    expiresIn: '3h'
                                })
                            })
                        }
                    })
                }
                
            })
        }
        
      })
}


module.exports = Router({mergeParams : true}).post('/register', createUser)