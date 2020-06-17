const Router = require('express').Router

const getFile = (request, response) => {
    var timestamp = request.body["timestamp"]
    var file_name = request.body["file_name"]
    var params = {
        Bucket : process.env.S3_BUCKET_NAME,
        Key : "chats/"+timestamp+"_"+file_name
    };
    request.s3.getObject(params, (error, data) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            console.log(data);
            console.log(data["Body"]);            
            /*var arr = new Uint8Array(data["Body"])
            console.log(arr);
            */
            response.status(200).send(data["Body"])
        }
    })
}

module.exports = Router().post('/home/chats/getFile', getFile);