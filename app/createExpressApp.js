const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
//const admin = require('firebase-admin')
//const http = require('http')
const morgan = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet')
//const pg = require('pg')
//const myRender = require('../render/render')

dotenv.config()
var privateKey = process.env.apiPrivateKey.replace(/\\n/g, '\n');
var publicKey = process.env.apiPublicKey.replace(/\\n/g, '\n');

const createApp = (winston,
    database, firebase_adm, s3, mailer
) => {
    const app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '20mb'
    }))
    app.use(helmet())
    app.use(morgan('combined', {
        stream: winston.stream.write
    }));
    /*var servicePath = path.join(__dirname, '..', 'youni-f47e4-firebase-adminsdk-gv79x-9243655fc0.json')
    var serviceAccount = require(servicePath)
    console.log(servicePath)
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://youni-f47e4.firebaseio.com/"
    })
    */
   /*
    var connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    };
    */
    /*const server = http.createServer(app)
    const io = require('socket.io').listen(app)
    console.log("IO")
    console.log(io)
    var socket = null;
    io.on('connection', (socketOnConn) => {
        console.log("Connect event")
        socket = socketOnConn;
        console.log("Client: " + socket.client)
    })
    */
    var myMid = (request, response, next) => {
        console.log('Setto impostazioni')
        request.database = database
        request.admin = firebase_adm //admin
        request.privateKey = privateKey
        request.publicKey = publicKey
        //request.pg_client = pg_client
        request.s3 = s3
        request.mailer = mailer
        //   request.socket = socket
        /* if(socket != null){
             request.socket = socket
         }*/
        next()
    }
    app.use(myMid)
    var middlewarePath = path.join(__dirname, '..', 'routes', 'middleware')
    fs.readdirSync(middlewarePath).forEach((file) => {
        var route = path.join(middlewarePath, file);
        //console.log(route)
        app.use(require(route))
    })
    var adminPath = path.join(__dirname, '..', 'routes', 'admin')
    fs.readdirSync(adminPath).forEach((element) => {
        app.use(require(path.join(adminPath, element)))
    })
    var routePath = path.join(__dirname, '..', 'routes', 'api')
   // console.log(routePath);
    fs.readdirSync(routePath).forEach((element) => {
        //faccio così perché la struttura avrà delle cartelle dopo api e poi i file, non dovrebbero esserci altre cartelle, se le aggiungo
        //va cambiato questo e renderlo ancora più generale
        var route = path.join(routePath, element);
        if (fs.lstatSync(route).isDirectory()) {
            console.log(route)
            fs.readdirSync(route).forEach((file) => {
                app.use(require(path.join(route, file)))
            });
        } else {
        //    console.log(route)
            //console.log(route)
            //require(route)(app);
            app.use(require(route))
        }
    })
    app.use(express.static("../public"))
    //app.route('/resetPassword').get(myRender.render_reset_password_template)
    /*
    var routePath = path.join(__dirname, '..', 'routes', 'chat')
    console.log(routePath);
    fs.readdirSync(routePath).forEach((file) => {
        var route = path.join(routePath, file);
        //console.log(route)
        //require(route)(app);
        app.use(require(route))
    })
  */

    return app;
}


module.exports = createApp