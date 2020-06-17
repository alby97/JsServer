const Router = require('express').Router

const verLogin = (request, response) => {
    response.status(200).send();
}


module.exports = Router().get('/home/verLogin', verLogin);