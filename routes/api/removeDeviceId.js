const Router = require('express').Router


const removeDeviceId = (request, response) => {
    var deviceId = request.body["deviceId"]
    console.log(deviceId)
    console.log("remove")
    request.database.query('UPDATE users SET device_ids = array_remove(device_ids, $1::character varying) WHERE username = $2', [deviceId, response.locals.decodedToken.username], (error, result) => {
        if (error) {
            console.log(error)
            response.status(400).json({
                message: "Errore"
            })
        } else {
            response.status(200).json({})
        }
    })
}

module.exports = Router({mergeParams : true}).post('/home/removeDeviceId', removeDeviceId)