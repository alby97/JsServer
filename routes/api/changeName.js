const Router = require('express').Router





/**
 *The user specify the new name and then it will
 be updated
 *
 * @param {*} request
 * @param {*} response
 */
const changeName = (request, response) => {
    const name = request.body
    request.database.query('UPDATE users SET name = $1 WHERE username = $2', [name, response.locals.decodedToken.username], (error, results) => {
        if (error) {
            response.status(403).json({
                message: 'Non è possibile cambiare nome'
            })
        } else {
            response.status(200).json({
                message: 'Il nome è stato cambiato con successo'
            })
        }
    })
}

module.exports = Router({mergeParams: true}).put('/home/changeName', changeName)