const path = require('path')


exports.render_reset_password_template = (request, response) => {
    return response.sendFile(path.resolve('../public/reset_password.html'))
}