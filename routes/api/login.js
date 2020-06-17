const Router = require('express').Router
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



/**
 *The user must specify the username and the
 password in the request
 if the username and the password are correct then
 the response will be 200
 else it will be 400
 *
 * @param {*} request
 * @param {*} response
 */
const login = (request, response) => {
    console.log(request.body)
    const {
        username,
        password,
        rememberMe
    } = request.body
    console.log(username)
    request.database.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
        if (error) {
            response.status(400).json({
                message: 'Utente non trovato'
            })
        } else {
            console.log("Login ")
            console.log(results.rows[0])
            var cryptPassword = results.rows[0]["password"]
            console.log(cryptPassword);

            bcrypt.compare(password, cryptPassword, (error2, result) => {
                console.log(error)
                console.log("Result");
                console.log(result)
                if (error2) {
                    console.log("1");
                    
                    response.status(400).json({
                        message: 'Username o password errati'
                    })
                } else {
                    if (result != false) {
                        console.log("RememberMe");
                        console.log(rememberMe);
                        var rem = JSON.parse(request.body["rememberMe"])
                        console.log(rem);
                        if (rem == false) {
                            console.log("ExpiresIn needed");
                            response.status(200).json({
                                token: jwt.sign({
                                    username: results.rows[0].username,
                                    email: results.rows[0].email,
                                    //  rating: results[0].rating,
                                    //profile_image_path: results[0].profile_image_path,
                                    course_study: results.rows[0].course_study,
                                    academic_year: results.rows[0].academic_year,
                                    department: results.rows[0].department,
                                    course_type: results.rows[0].course_type,
                                    course_address: results.rows[0].course_address,
                                    name: results.rows[0].name,
                                    surname: results.rows[0].surname
                                }, request.privateKey, {
                                    algorithm: 'RS256',
                                    expiresIn: '3h'
                                },),
                                joinedChats: results.rows[0]["joined_chats"],
                                chatsToNotify: results.rows[0]["chats_to_notify"]
                            })
                        } else {
                            console.log("No expiresIn");
                            response.status(200).json({
                                token: jwt.sign({
                                    username: results.rows[0].username,
                                    email: results.rows[0].email,
                                    //  rating: results[0].rating,
                                    //profile_image_path: results[0].profile_image_path,
                                    course_study: results.rows[0].course_study,
                                    academic_year: results.rows[0].academic_year,
                                    department: results.rows[0].department,
                                    course_type: results.rows[0].course_type,
                                    course_address: results.rows[0].course_address,
                                    name: results.rows[0].name,
                                    surname: results.rows[0].surname
                                }, request.privateKey, {
                                    algorithm: 'RS256'
                                }),
                                joinedChats: results.rows[0]["joined_chats"],
                                chatsToNotify: results.rows[0]["chats_to_notify"]
                            })

                        }

                    } else {
                        console.log("2");
                        
                        response.status(400).json({
                            message: 'Username o password errati'
                        })
                    }

                    /*
                    var arr = "{"
                    arr += deviceId
                    arr += "}"
                    */
                    /*
                     request.database.query('UPDATE users SET device_ids = device_ids || $1 WHERE username = $2 RETURNING *', [arr, username], (error, result2) => {
                         if(error) {
                             response.status(500).json({'message' : 'Impossibile completare l\'operazione.'})
                         }
                         else{
                             response.status(200).json({
                                 token: jwt.sign({
                                     username: result2.rows[0].username,
                                     email: result2.rows[0].email,
                                     //  rating: results[0].rating,
                                     //profile_image_path: results[0].profile_image_path,
                                     course_study: result2.rows[0].course_study,
                                     academic_year: result2.rows[0].academic_year,
                                     department: result2.rows[0].department,
                                     course_type: result2.rows[0].course_type,
                                     device_id: result2.rows[0].device_ids[0]
                                     // interests: results[0].interests,
                                     // name: results[0].name,
                                     // surname: results[0].surname
                                 }, request.privateKey, {
                                     algorithm: 'RS256'
                                 }, {
                                     expiresIn: '3h'
                                 })
                             })
                         }
                     })*/
                }

            })
        }

    })
}


module.exports = Router().post('/login', login)