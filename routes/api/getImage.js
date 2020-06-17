const Router = require('express').Router


const getImage = (request, response) => {
    request.database.query('SELECT * FROM users WHERE username = $1', [response.locals.decodedToken.username], (error, result) => {
        if (error) {
            response.status(400).json({
                message: 'Errore nella richiesta.'
            })
        } else {
            console.log(result.rows)
            var image_path = result.rows[0].profile_image_path;
            var params = {
                Bucket : process.env.S3_BUCKET_NAME,
                Key : image_path
            }
            request.s3.getObject(params, (errorS3, data) => {
                if(errorS3){
                    console.log(errorS3)
                    response.status(500).send()
                }
                else {
                    response.status(200).send(data["Body"])
                }
            })
        }
    })
}

module.exports = Router({mergeParams : true}).get('/home/getImage', getImage)
