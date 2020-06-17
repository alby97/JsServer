const Router = require('express').Router

const getUserInfo = (request, response) => {
    console.log(response.locals.decodedToken.username)
    console.log("Info")
    request.database.query('SELECT * FROM users WHERE username = $1', [response.locals.decodedToken.username], (err, result) => {
        console.log(result.rows[0])
        if (err) {
            response.status(400).json({
                message: "Errore, riprovare"
            })
        } else {
            response.status(200).json({
                username: result.rows[0].username,
                email: result.rows[0].email,
                courseStudy: result.rows[0].course_study,
                courseType : result.rows[0].course_type,
                courseAddress : result.rows[0].course_address,
                rating: result.rows[0].rating,
                name: result.rows[0].name,
                surname: result.rows[0].surname
            })
        }
    })
}


module.exports = Router().get('/home/userInfo', getUserInfo)
