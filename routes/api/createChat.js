/* eslint-disable no-unused-vars */
const Router = require('express').Router


const createChat = (request, response) => {
    var title = request.body['title']
    var categoryName = request.body['category']
    request.database.query("INSERT INTO chats (title, category) VALUES  ($1, $2)", [title, categoryName], (error, result) => {
        if (error) {
            console.error(error)
            response.status(400).json({
                message: "Errore, riprovare"
            })
        } else {
            response.status(201).json({
                message: "La chat è stata creata con successo!"
            })
            var topic = 'CATEGORIA_' + categoryName.replace(/ /g, '_')
                    var message = {
                        'notification' : {
                            title : 'È stata creata una nuova chat in: ' + categoryName
                        },
                        'data' : {
                            'author' : response.locals.decodedToken.username,
                            'chat' : title,
                            'category' : categoryName,
                            'type_of_notification' : 'Created Interest Chat',
                            'click_action' : 'FLUTTER_NOTIFICATION_CLICK'
                        },
                        topic : topic
                    }
                    request.admin.messaging().send(message).then((response) => {
                        console.log('Successfully sent message: ', response);
                    }).catch((error) => {
                        console.error("Error sending message: ", error)
                    })
           /* var titleChat = "{" + title + "}";
            console.log(titleChat)
            request.database.query("UPDATE categories SET chats = chats || $1 WHERE name = $2", [titleChat, categoryName], (error2, result2) => {
                if (error2) {
                    console.error(error2)
                } else {
                    response.status(201).json({
                        message: "La chat è stata creata con successo!"
                    })
                    /*
                    var topic = 'CATEGORIA_' + categoryName.replace(/ /g, '_')
                    var message = {
                        'notification' : {
                            title : 'È stata creata una nuova chat in: ' + categoryName
                        },
                        'data' : {
                            'author' : response.locals.decodedToken.username,
                            'chat' : title,
                            'category' : categoryName,
                            'type_of_notification' : 'Created Interest Chat',
                            'click_action' : 'FLUTTER_NOTIFICATION_CLICK'
                        },
                        topic : topic
                    }
                    request.admin.messaging().send(message).then((response) => {
                        console.log('Successfully sent message: ', response);
                    }).catch((error) => {
                        console.error("Error sending message: ", error)
                    })
                    
                }
            })
*/
        }
    })
    
}

module.exports = Router().post('/home/createChat', createChat);