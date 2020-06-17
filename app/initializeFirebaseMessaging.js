const path = require('path')

const admin = require('firebase-admin')
console.log("Initialize");
//console.log(admin);
var servicePath = path.join(__dirname, '..', 'youni-f47e4-firebase-adminsdk-gv79x-9243655fc0.json')
var serviceAccount = require(servicePath)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://youni-f47e4.firebaseio.com/"
})




module.exports = admin;