const port = (process.env.PORT || 5000)
const path = require('path')
const winston = require(path.join(__dirname, 'logging', 'winstonConfig'))
const database = require('./database/createDatabase')
const firebase_adm = require('./app/initializeFirebaseMessaging')
const s3 = require('./awsS3/s3')
const mailer = require('./mailer/mailer')
const app = require('./app/createExpressApp')(winston, database, firebase_adm, s3, mailer)
const all_routes = require('express-list-endpoints')


app.get('/', (request, response) => {
    response.send("Ciao")
})


console.log(all_routes(app))

//console.log(firebase_adm);





const server = require('http').createServer(app)

server.listen(port, () => {
    console.log("Server listen on " + port)    
})
/*
app.listen(port, () => {
    console.log("Server listen on "+ port)    
})
*/
//const io = require("socket.io").listen(server)

//console.log(io)
/*
io.on('connection', (socketOnConn) => {
    console.log("Connect event")
    var socket = socketOnConn;
    console.log("Client: " + socket.client)
})
*/
//app.set('io', io)

const io = require(path.join(__dirname, 'socket.io', 'myIO'))(server, database, firebase_adm, s3)