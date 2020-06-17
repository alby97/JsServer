const Router = require('express').Router

const lessonChangeDislike = (request, response) => {
    var id = request.body["id"]
    var username = "{" + response.locals.decodedToken.username + "}"
    var liked = JSON.parse(request.body["liked"])
    var disliked = JSON.parse(request.body["disliked"])
    if (disliked == true) {
        //!in array remove ci va solo il valore, per concatenare invece vanno aggiunte le parentesi graffe
        request.database.query('UPDATE lessons_changes set dislikes = array_remove(dislikes, $2::character varying) WHERE id = $1 RETURNING *', [id, response.locals.decodedToken.username], (error, result) => {
            if (error) {
                response.status(500).send()
            } else {
                response.status(201).json({
                    "data" : result.rows[0]
                })
            }
        })
    } else {
        if (liked == true) {
            request.database.query('UPDATE lessons_changes SET likes = array_remove(likes, $2::character varying) WHERE id = $1', [id, response.locals.decodedToken.username], (error1, result1) => {
                if (error1) {
                    console.log(error1)
                    response.status(500).send()
                } else {
                    request.database.query('UPDATE lessons_changes SET dislikes = dislikes || $2 WHERE id = $1  RETURNING *', [id, username], (error2, result2) => {
                        if (error2) {
                            console.log(error2)
                            response.status(500).send()
                        } else {
                            response.status(201).json({
                                "data": result2.rows[0],
                            })
                        }
                    })
                }
            })
        } else {
            request.database.query('UPDATE lessons_changes SET dislikes = dislikes || $2 WHERE id = $1  RETURNING *', [id, username], (error3, result3) => {
                if (error3) {
                    console.error(error)
                    response.status(500).send()
                } else {
                    console.log(result3.rows[0])
                    response.status(201).json({
                        "data": result3.rows[0]
                    })
                }

            })
        }
    }

/*

    request.database.query('UPDATE lessons_changes SET dislikes = dislikes + 1 WHERE id = $1 RETURNING *', [id], (error, result) => {
        if(error) {
            console.error(error)
            response.status(500).send()
        }
        else {
            console.log(result.rows[0])
            response.status(201).json(
                {
                    "dislikes" : result.rows[0]
                }
            )
        }

    })
    */
}


module.exports = Router().post('/home/lessonsChangeDislike', lessonChangeDislike)