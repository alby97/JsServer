const Router = require('express').Router
const path = require('path')

const render_reset_password_template = (request, response) => {
    return response.sendFile(path.join(__dirname, '..', '..', 'public', 'reset_password.html'))
}

module.exports = Router().get('/public/resetPassword', render_reset_password_template)