const Router = require('express').Router

//colonne di lessons_changes: teaching, description, author
//likes (inizialmente 0), dislikes (inizialmente 0), course_name,
//course_type, title, classroom, new_time

const saveLessonChange = (request, response) => {
  console.log("Save lessons Change")
  console.log(request.body)
  var {
    teaching,
    description,
    author,
    course_name,
    course_type,
    type,
    classroom,
    new_time,
    timestamp,
    old_time,
    author_name,
    author_surname
  } = request.body
  console.log(teaching)
  request.database.query("INSERT INTO lessons_changes (description, author, course_name, course_type, type, classroom, new_time, teaching, timestamp, old_time, author_name, author_surname) VALUES ($2, $3, $4, $5, $6, $7, $8, $1, $9, $10, $11, $12) RETURNING *", [teaching, description, author, course_name, course_type, type, classroom, new_time, timestamp, old_time, author_name, author_surname], (error, result) => {
    if (error) {
      console.log(error)
      response.status(500).json({
        "message": "L'operazione non può essere completata"
      })
    } else {
      response.status(201).json({
        "message": "L'operazione è stata completata con successo."
      })

      var jTeach = JSON.parse(teaching)

      var topic = (jTeach["name"] + "_" + jTeach["indirizzo"] + "_" + jTeach["cfu"]).replace(/ /g, '_');
      console.log("Topic: " + topic);
      /*
      var message = {
        notification : {
          title: 'Nuova variazione',
          body: `${description} `,
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        }
      };
      console.log(message);
      request.admin.messaging().sendToTopic(topic, message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
        */
       console.log(result.rows[0]);
       
      var message = {
        'notification': {
          title: 'Nuova variazione',
        },
        'data': {
          /*
          'author': `${author}`,
          'description': `${description} `,
          'teaching' : `${teaching}`,
          'course_name' : `${course_name}`,
          'course_type' : `${course_type}`,
          'type' : `${type}`,
          'classroom' : `${classroom}`,
          'new_time' : `${new_time}`,
          'timestamp' : `${timestamp}`,
          'likes' : '0',
          'dislikes' : '0'
          */
          'id' : result.rows[0]['id'],
          'author': `${author}`,
          'description': `${description} `,
          'type_of_notification' : 'Lesson Change'
        },
        topic: topic,
      }
      console.log(message);
      console.log(message['data']);


      request.admin.messaging().send(message).then((response) => {
        console.log('Successfully sent message: ', response);
      }).catch((error) => {
        console.log("Error sending message:", error);
      })
    }
  })
}


module.exports = Router().post("/home/saveLessonChange", saveLessonChange)