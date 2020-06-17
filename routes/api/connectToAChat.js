const Router = require('express').Router;

const connectToAChat = (request, response) => {
    request.pg_client.connect();
    var query = pg_client.query("LISTEN new_chat_message");
    request.io.sockets.on('connection', (socket) => {
        socket.emit('connected', {connected : true});
        /*
        socket.on('ready for data', (data) => {
            pg_client.on('notification', (title) => {
                socket.broadcast.emit('update', {message : title});
            })
        })
        */
        socket.on('chat message', (message) => {
            pg_client.on('notification', (title) => {
                socket.broadcast.emit('update', {message : title})
            })
        })
        socket.on('disconnect', () => {
            //TODO: da vedere se bisogno fare qualcosa
        })
    })
}

module.exports = Router().get('/home/connectToAChat', connectToAChat)