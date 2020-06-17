var bcrypt = require('bcrypt')
const Router = require('express').Router


/**
 *The user specify the old and the new password
 if the oldPassword doesn't match with the one that
 is stored in the database  the response will be 400
if there are others error when trying to update the 
password the response will be 500
else the response will be 200
 *
 * @param {*} request
 * @param {*} response
 */

const changePassword = (request, response) => {
    const {
        oldPassword,
        newPassword
    } = request.body
    bcrypt.hash(newPassword, 10, (error, hash) => {
        if (error) {
            response.status(500).json({
                message: 'Errore'
            })
        } else {
            request.database.query('SELECT * FROM users WHERE username = $1', [response.locals.decodedToken.username], (error, results) => {
                if (error) {
                    response.status(400).json({
                        message: 'Non è stato possibile cambiare la password'
                    })
                } else {
                    bcrypt.compare(oldPassword, results.rows[0].password, (error, value) => {
                        if (error) {
                            response.status(400).json({
                                message: 'La vecchia password è errata'
                            })
                        } else {
                            if (value) {
                                request.database.query('UPDATE users SET password = $1 WHERE username = $2', [hash, response.locals.decodedToken.username], (error, results) => {
                                    if (error) {
                                        response.status(500).json({
                                            message: 'Non è stato possibile cambiare password, riprovare.'
                                        })
                                    } else {
                                        response.status(200).json({
                                            message: 'La password è stata cambiata con successo'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}

module.exports = Router({mergeParams : true}).put('/home/changePassword', changePassword)