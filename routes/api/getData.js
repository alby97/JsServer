const Router = require('express').Router


/**
 *This methods returns the data after the token is verified
 *@param {*} decodedToken contains the paylod with the useful
 *information for the user
 *
 * @param {*} request
 * @param {*} response
 */
const getData = (request, response) => {
    var data = response.locals.decodedToken
    response.status(200).json({
        'data' : `${data}`
    });
}

module.exports = Router({mergeParams : true}).get('/home/userProfile', getData)