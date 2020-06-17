const Router = require('express').Router


/**
 *The user request contains the path of the his new profile image
 *
 * @param {*} request
 * @param {*} response
 */
const saveImage = (request, response) => {
    console.log('Change')
    console.log(response.locals.decodedToken.username)
    var imageToUpload = new Buffer.from(request.body["image"], "base64")
    var fileName = request.body["fileName"]
    var key = "users_profile_image/" + response.locals.decodedToken.username + "/" +  fileName
    var params = {
        Bucket : process.env.S3_BUCKET_NAME,
        Body: imageToUpload,
        Key: key
    };
    request.s3.upload(params, (error, data) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            //var url = data.Location
            request.database.query('UPDATE users SET profile_image_path = $1 WHERE username = $2 RETURNING *', [key, response.locals.decodedToken.username], (error, result) => {
                console.log(result.rows[0])
                if (error) {
                    response.status(500).json({
                        message: 'Non è possibile salvare l\'immagine'
                    })
                } else {
                    response.status(201).json({
                        message: 'L\'immagine è stata salvata con successo'
                    })
                }
            })
        }
    })
    /*
    const image_path = request.body
    request.database.query('UPDATE users SET profile_image_path = $1 WHERE username = $2 RETURNING *', [image_path, response.locals.decodedToken.username], (error, result) => {
        console.log(result.rows[0])
        if (error) {
            response.status(403).json({
                message: 'Non è possibile salvare l\'immagine'
            })
        } else {
            response.status(201).json({
                message: 'L\'immagine è stata salvata con successo'
            })
        }
    })
    */
}


module.exports = Router({mergeParams : true}).put('/home/saveImage', saveImage)




/*
! This is to upload images on s3... Implement that later
const saveImage = (request, response) => {
    console.log('Change')
    console.log(response.locals.decodedToken.username)
    const image_path = request.body
    var imageToUpload = new Buffer.from(request.body["image"])
    var fileName = request.body["fileName"]
    var params = {
        Bucket : process.env.S3_BUCKET_NAME,
        Body: imageToUpload,
        Key: "users_profile_image/" + response.locals.decodedToken.username + "/" +  fileName
    };
    request.s3.upload(params, (error, data) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            var url = data.Location
            request.database.query('UPDATE users SET profile_image_path = $1 WHERE username = $2 RETURNING *', [url, response.locals.decodedToken.username], (error, result) => {
                console.log(result.rows[0])
                if (error) {
                    response.status(500).json({
                        message: 'Non è possibile salvare l\'immagine'
                    })
                } else {
                    response.status(201).json({
                        message: 'L\'immagine è stata salvata con successo'
                    })
                }
            })
        }
    })
}

*/