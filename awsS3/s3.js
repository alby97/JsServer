const AWS = require('aws-sdk')
const fs= require('fs')

AWS.config.update({
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
})

const s3 = new AWS.S3();


module.exports = s3;