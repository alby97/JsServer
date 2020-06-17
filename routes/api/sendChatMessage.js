const Router = require('express').Router;


const sendChatMessage = (request, response) => {
    request.database.query("SELECT id_chat FROM chats WHERE title = $1", [request.body["chatName"]], (error, result) => {
        if(error){
            console.error(error);
            response.status(500).json({
                message : "Errore"
            });
        }
        else {
            console.log(result.rows[0])
            console.log(result.rows[0]["id_chat"])
            request.database.query("INSERT INTO messages (author, content, id_chat) VALUES ($1, $2, $3)", [response.locals.decodedToken.username, request.body["message"], result.rows[0]["id_chat"]], (error2, result2) => {
                if(error2){
                    console.error(error2)
                    response.status(500).json({
                        message : "Errore"
                    })
                }
                else{
                    console.log(request)
                    console.log(request.socket)
                    request.socket.broadcast.emit('chat message', {
                        message: request.body["message"],
                        username : response.locals.decodedToken.username
                    })
                    response.status(201).send()
                }
            })
        }
    })
    
}

module.exports = Router().post('/home/chats/sendChatMessage', sendChatMessage)