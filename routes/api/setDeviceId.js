const Router = require('express').Router
const jwt = require('jsonwebtoken')


const setDeviceId = (request, response) => {
    var arr = "{"
    var deviceId = request.body["deviceId"]
    console.log(deviceId)
    console.log(response.locals.decodedToken)
    arr += deviceId
    arr += "}"
    console.log(arr)
    //console.log(request.body)
    request.database.query('UPDATE users SET device_ids = device_ids || $1 WHERE username = $2 RETURNING *', [arr, response.locals.decodedToken.username], (error, result) => {
        if (error) {
            console.log(error)
            response.status(400).json({
                message: "Errore"
            })
        } else {
            var refresh = JSON.parse(request.body["refreshTokenNeeded"])
            console.log(refresh);
            if (refresh == true) {
                response.status(200).json({
                    token: jwt.sign({
                        username: result.rows[0].username,
                        email: result.rows[0].email,
                        //  rating: results[0].rating,
                        //profile_image_path: results[0].profile_image_path,
                        course_study: result.rows[0].course_study,
                        academic_year: result.rows[0].academic_year,
                        department: result.rows[0].department,
                        course_type: result.rows[0].course_type,
                        course_address: result.rows[0].course_address,
                        device_id: result.rows[0].device_ids[0],
                        name: result.rows[0].name,
                        surname: result.rows[0].surname
                    }, request.privateKey, {
                        algorithm: 'RS256',
                        expiresIn: '3h'
                    }),
                    "name": result.rows[0]["name"],
                    "surname": result.rows[0]["surname"]
                }) //va bene qui non mettere joinedchats perché se è true significa che si è appena registrato
                //quindi non avrà chat, in ogni caso quando entrerà in una chat si aggiungerà, implementato nelle altre API
            } else {
                response.status(200).send({
                    "name": result.rows[0]["name"],
                    "surname": result.rows[0]["surname"]
                })
            }

        }
    })
}

module.exports = Router({
    mergeParams: true
}).post('/home/setDeviceId', setDeviceId)