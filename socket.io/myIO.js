/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
const io = require("socket.io");
const fs = require('fs')

const myIO = (server, database, firebase_adm, s3) => {
    var serverIO = io.listen(server)
    var nspChat = serverIO.of("/chat")
    nspChat.on("connection", (socket) => {
        console.log("connection event")
        //console.log(nspChat)
        socket.on("join", (data) => {
            console.log(data)
            console.log("Join event")
            //var arr = "{" + data["chatName"] + "}";
            console.log(data["chatName"])
            console.log(JSON.parse(data["is_academic"]))
            if (JSON.parse(data["is_academic"]) == true) {
                var arr = "{" + "chat_acc_" + data["idChat"] + "}";
                socket.join("chat_acc_" + data["idChat"], () => {
                    if (data["joined"] != true) {
                        database.query("UPDATE users SET joined_chats = joined_chats || $1, chats_to_notify = chats_to_notify || $1 WHERE username = $2 RETURNING *", [arr, data["username"]], (error, result) => {
                            if (error) {
                                console.error(error);
                            } else {
                                console.log("Query executed");
                            }
                        })
                    }
                    console.log(socket.rooms)
                    console.log("Rooms Join 2")
                })
            } else {
                var arr = "{" + "chat_sv_" + data["idChat"] + "}";
                socket.join("chat_sv_" + data["idChat"], () => {
                    if (data["joined"] != true) {
                        database.query("UPDATE users SET joined_chats = joined_chats || $1, chats_to_notify = chats_to_notify || $1 WHERE username = $2 RETURNING *", [arr, data["username"]], (error, result) => {
                            if (error) {
                                console.error(error);
                            } else {
                                console.log("Query executed");
                            }
                        })
                    }
                    console.log(socket.rooms)
                    console.log("Rooms Join 2")
                })
            }
        })
        socket.on('chat message', (data) => {
            var author = data["author"]
            var message = data["message"]
            var chat = data["chat"]
            var chatId = data["idChat"]
            var timestamp = data["timestamp"]
            var message_type = data["message_type"]
            var url = ''; //TODO: implementare l'upload
            var name = data["author_name"]
            var surname = data["author_surname"]
            //mettere il msg nel db
            console.log("Rooms")
            let rooms = Object.keys(socket.rooms);
            console.log(rooms);
            console.log(author)
            console.log(chat)
            console.log(message)
            if (message_type == "text") {
                console.log("data");
                console.log(data)
                if (JSON.parse(data["is_academic"]) == true) {
                    /*   var arrChatName = chat.split('_')
                               console.log("a", arrChatName);
                               var course_name = arrChatName[0]
                               var course_type = arrChatName[1]
                               var year_regulation = arrChatName[2]
                               var cfu = arrChatName[3]
                               var teaching = arrChatName[4]
                               */
                    database.query("INSERT INTO academic_messages (author, message, id_chat, timestamp, message_type, author_name, author_surname) VALUES ($1, $2, $3, $4, $5, $6, $7)", [author, message, chatId, timestamp, message_type, name, surname], (error, result) => {
                        console.log(error)
                        console.log(result.rows)
                        if (error) {
                            console.error(error)
                            //callback({response : "Errore"})
                        } else {
                            console.log(data);
                            console.log("Broadcasting message")
                            console.log(chat);
                            nspChat.to("chat_acc_" + chatId).emit('chat message', [{
                                "author": author,
                                "message": message,
                                "timestamp": timestamp,
                                "message_type": "text",
                                "author_name": name,
                                "author_surname": surname
                            }])
                            console.log("Message emitted")
                            //var chatTopic = "CHAT_" + chat.replace(/ /g, '_');
                            var chatTopic = "chat_acc_" + chatId
                            var message2 = {
                                'notification': {
                                    title: 'Nuovo messaggio in ' + chat,
                                },
                                'data': {
                                    'id': `${chatId}`,
                                    'chat': chat,
                                    'author': `${author}`,
                                    'chat_message': `${message} `,
                                    'is_academic': `${true}`,
                                    'type_of_notification': 'Chat Message',
                                    "click_action": "FLUTTER_NOTIFICATION_CLICK"
                                },
                                topic: chatTopic,
                            }
                            //console.log(firebase_adm);
                            firebase_adm.messaging().send(message2).then((response) => {
                                console.log('Successfully sent message: ', response);
                            }).catch((error) => {
                                console.log("Error sending message:", error);
                            })
                            /* database.query("SELECT id FROM academic_chats WHERE course_name = $1 AND course_type = $2 AND year_regulation = $3 AND cfu = $4 AND teaching = $5", [course_name, course_type, year_regulation, cfu, teaching], (error2, result2) => {
                                 if (error2) {
                                     console.error(error2)
                                     //  callback({response : "Errore"})
                                 } else {
                                     console.log(result2.rows[0])
                                     console.log("Broadcasting message")
                                     console.log(chat);
                                     nspChat.to(data["id"]).emit('chat message', [{
                                         "author": author,
                                         "message": message,
                                         "timestamp": timestamp,
                                         "message_type": "text",
                                         "author_name": name,
                                         "author_surname": surname
                                     }])
                                     console.log("Message emitted")
                                     //var chatTopic = "CHAT_" + chat.replace(/ /g, '_');
                                     var chatTopic = "chat_acc_"+data["id"]
                                     console.log(data['id'])
                                     var message2 = {
                                         'notification': {
                                             title: 'Nuova messaggo in ' + chat,
                                         },
                                         'data': {
                                             'id': `${data["id"]}`,
                                             'chat': chat,
                                             'author': `${author}`,
                                             'chat_message': `${message} `,
                                             'is_academic' : `${true}`,
                                             'type_of_notification': 'Chat Message',
                                             "click_action": "FLUTTER_NOTIFICATION_CLICK"
                                         },
                                         topic: chatTopic,
                                     }
                                     //console.log(firebase_adm);
                                     firebase_adm.messaging().send(message2).then((response) => {
                                         console.log('Successfully sent message: ', response);
                                     }).catch((error) => {
                                         console.log("Error sending message:", error);
                                     })
                                 }
                             })*/
                        }
                    })
                } else {
                    database.query("INSERT INTO messages (author, message, id_chat, timestamp, message_type, author_name, author_surname) VALUES ($1, $2, (SELECT id_chat FROM chats WHERE title = $3), $4, $5, $6, $7)", [author, message, chat, timestamp, message_type, name, surname], (error, result) => {
                        console.log(error)
                        console.log(result.rows)
                        if (error) {
                            console.error(error)
                            //callback({response : "Errore"})
                        } else {
                            console.log(data);
                            console.log("Broadcasting message")
                            console.log(chat);
                            console.log(chatId)
                            console.log(data["idChat"])
                            nspChat.to("chat_sv_" + chatId).emit('chat message', [{
                                "author": author,
                                "message": message,
                                "timestamp": timestamp,
                                "message_type": "text",
                                "author_name": name,
                                "author_surname": surname
                            }])
                            console.log("Message emitted")
                            //var chatTopic = "CHAT_" + chat.replace(/ /g, '_');
                            var chatTopic = "chat_sv_" + chatId
                            var message2 = {
                                'notification': {
                                    title: 'Nuovo messaggio in ' + chat,
                                },
                                'data': {
                                    'id': `${chatId}`,
                                    'chat': chat,
                                    'author': `${author}`,
                                    'chat_message': `${message} `,
                                    'type_of_notification': 'Chat Message',
                                    "click_action": "FLUTTER_NOTIFICATION_CLICK"
                                },
                                topic: chatTopic,
                            }
                            //console.log(firebase_adm);
                            firebase_adm.messaging().send(message2).then((response) => {
                                console.log('Successfully sent message: ', response);
                            }).catch((error) => {
                                console.log("Error sending message:", error);
                            })
                            /*  database.query("UPDATE chats SET messages = to_jsonb(ARRAY[$1]) || messages WHERE title = $2 RETURNING *", [data, chat], (error2, result2) => {
                                  if (error2) {
                                      console.error(error2)
                                      //  callback({response : "Errore"})
                                  } else {
                                      console.log("Broadcasting message")
                                      console.log(chat);
                                      nspChat.to(chat).emit('chat message', [{
                                          "author": author,
                                          "message": message,
                                          "timestamp": timestamp,
                                          "message_type": "text",
                                          "author_name": name,
                                          "author_surname": surname
                                      }])
                                      console.log("Message emitted")
                                      var chatTopic = "CHAT_" + chat.replace(/ /g, '_');
                                      var message2 = {
                                          'notification': {
                                              title: 'Nuova messaggo in ' + chat,
                                          },
                                          'data': {
                                              'id': result2.rows[0]['id_chat'],
                                              'chat': chat,
                                              'author': `${author}`,
                                              'chat_message': `${message} `,
                                              'type_of_notification': 'Chat Message',
                                              "click_action": "FLUTTER_NOTIFICATION_CLICK"
                                          },
                                          topic: chatTopic,
                                      }
                                      //console.log(firebase_adm);
                                      firebase_adm.messaging().send(message2).then((response) => {
                                          console.log('Successfully sent message: ', response);
                                      }).catch((error) => {
                                          console.log("Error sending message:", error);
                                      })
                                  }
                              })*/
                        }
                    })
                }
            } else {
                console.log(data)
                var file = data["file"]
                var file_name = data["file_name"];
                console.log(file);
                var fileToUpload = new Buffer.from(file)
                var audioDuration = data["audio_duration"]
                var params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Body: fileToUpload, //TODO: da vedere come lo posso mandare via socket.io
                    Key: "chats/" + timestamp + "_" + file_name
                };
                s3.upload(params, (error, data2) => {
                    if (error) {
                        console.error(error);
                        //TODO: gestire meglio l'errore
                    } else {
                        console.log(data);
                        url = data2.Location //get the url
                        if (JSON.parse(data["is_academic"]) == false) {
                            database.query("INSERT INTO messages (author, message, id_chat, timestamp, message_type, url, file_name, author_name, author_surname, audio_duration) VALUES ($1, $2, (SELECT id_chat FROM chats WHERE title = $3), $4, $5, $6, $7, $8, $9, $10)", [author, "", chat, timestamp, message_type, url, file_name, name, surname, audioDuration], (error, result) => {
                                console.log(error)
                                //console.log(result.rows)
                                if (error) {
                                    console.error(error)
                                    //callback({response : "Errore"})
                                } else {
                                    var msgToInsert = {
                                        "author": author,
                                        "message": "",
                                        "timestamp": timestamp,
                                        "message_type": message_type,
                                        "url": url,
                                        "file_name": file_name,
                                        "author_name": name,
                                        "author_surname": surname,
                                        "audio_duration": audioDuration
                                    }
                                    database.query("UPDATE chats SET messages = to_jsonb(ARRAY[$1]) || messages WHERE title = $2 RETURNING *", [msgToInsert, chat], (error2, result2) => {
                                        if (error2) {
                                            console.error(error2)
                                            //  callback({response : "Errore"})
                                        } else {
                                            console.log("Broadcasting message")
                                            console.log(chat);
                                            nspChat.to("chat_sv_" + chatId).emit('chat message', [{
                                                "author": author,
                                                "message": message,
                                                "timestamp": timestamp,
                                                "url": url,
                                                "message_type": message_type,
                                                "file_name": file_name,
                                                "author_name": name,
                                                "author_surname": surname,
                                                "audio_duration": audioDuration
                                                //TODO: bisogna aggiungere qualche campo
                                            }])
                                            console.log("Message emitted")
                                            //var chatTopic = "CHAT_" + chat.replace(/ /g, '_');
                                            var chatTopic = "chat_sv_" + chatId
                                            var message2 = {
                                                'notification': {
                                                    title: 'Nuovo messaggio in ' + chat,
                                                },
                                                'data': {

                                                    'id': result2.rows[0]['id_chat'],
                                                    'chat': chat,
                                                    'author': `${author}`,
                                                    'chat_message': 'Nuovo ' + message_type,
                                                    'type_of_notification': 'Chat Message',
                                                    "click_action": "FLUTTER_NOTIFICATION_CLICK"
                                                },
                                                topic: chatTopic,
                                            }
                                            //console.log(firebase_adm);
                                            firebase_adm.messaging().send(message2).then((response) => {
                                                console.log('Successfully sent message: ', response);
                                            }).catch((error) => {
                                                console.log("Error sending message:", error);
                                            })
                                        }
                                    })
                                }
                            })

                        } else {
                            database.query("INSERT INTO academic_messages (author, message, id_chat, timestamp, message_type, url, file_name, author_name, author_surname, audio_duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [author, "", chatId, timestamp, message_type, url, file_name, name, surname, audioDuration], (error, result) => {
                                console.log(error)
                                console.log(result.rows)
                                if (error) {
                                    console.error(error)
                                    //callback({response : "Errore"})
                                } else {
                                    var msgToInsert = {
                                        "author": author,
                                        "message": "",
                                        "timestamp": timestamp,
                                        "message_type": message_type,
                                        "url": url,
                                        "file_name": file_name,
                                        "author_name": name,
                                        "author_surname": surname,
                                        "audio_duration": audioDuration
                                    }
                                    console.log("Broadcasting message")
                                    console.log(chat);
                                    nspChat.to("chat_acc_" + chatId).emit('chat message', [{
                                        "author": author,
                                        "message": message,
                                        "timestamp": timestamp,
                                        "url": url,
                                        "message_type": message_type,
                                        "file_name": file_name,
                                        "author_name": name,
                                        "author_surname": surname,
                                        "audio_duration": audioDuration
                                        //TODO: bisogna aggiungere qualche campo
                                    }])
                                    console.log("Message emitted")
                                    //var chatTopic = "CHAT_" + chat.replace(/ /g, '_');
                                    var chatTopic = "chat_acc_" + data["id"]
                                    var message2 = {
                                        'notification': {
                                            title: 'Nuovo messaggio in ' + chat,
                                        },
                                        'data': {

                                            'id': chatId,
                                            'chat': chat,
                                            'author': `${author}`,
                                            'chat_message': 'Nuovo ' + message_type,
                                            'type_of_notification': 'Chat Message',
                                            "click_action": "FLUTTER_NOTIFICATION_CLICK"
                                        },
                                        topic: chatTopic,
                                    }
                                    //console.log(firebase_adm);
                                    firebase_adm.messaging().send(message2).then((response) => {
                                        console.log('Successfully sent message: ', response);
                                    }).catch((error) => {
                                        console.log("Error sending message:", error);
                                    })


                                }
                            })
                        }
                    }

                })
            }



        })
        socket.on("disconnect", (data) => {
            console.log("Disconnect event");
            socket.disconnect()
        })
    })
}

module.exports = myIO;