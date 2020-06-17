const Router = require('express').Router
const crypto = require('crypto')
const Email = require('email-templates')
const path = require('path')
const handlebars = require("handlebars")
const fs = require("fs")

const forgotPassword = (request, response) => {
    var nameOrEmail = request.body["nameOrEmail"]
    console.log(nameOrEmail)
    request.database.query('SELECT * FROM users WHERE email = $1 OR username = $1', [nameOrEmail], (error, result) => {
        if(error) {
            response.status(420).send('L\'username o l\'email fornita non sono presenti.')
        }
        else {
            crypto.randomBytes(20, (error, buffer) => {
                if(error) {
                    console.log('Errore nella generazione del token')
                    response.status(500).send()
                }
                else {
                    var resetToken = buffer.toString('hex')
                    var expiration = Date.now() + 3600000
                    var expTs = expiration.toString()
                    console.log(result.rows)
                    request.database.query('UPDATE users SET reset_password_token = $1, reset_password_token_expiration = $3 WHERE username = $2 RETURNING *', [resetToken, result.rows[0]["username"], expTs], (error, result2) => {
                        if(error) {
                            console.log('Errore token db')
                            response.status(500).send()
                        }
                        else {
                            var contextObject = {
                                url : 'https://youniserverlabeu.herokuapp.com/public/resetPassword?token=' + resetToken,
                                name : result2.rows[0]["name"] + " " + result2.rows[0]["surname"]
                            }
                          /*  var data = {
                                to: result2.rows[0]['email'],
                                from: process.env.RECOVERY_PASSWORD_MAILER_EMAIL, //request.mailer.email,
                                template: 'forgot-password-email',
                                subject: 'YoUni - Richiesta reset password',
                                context : {
                                    url : 'https://youniserverlabeu.herokuapp.com/reset_password?token=' + resetToken,
                                    name : result2.rows[0]["name"] + " " + result2.rows[0]["surname"]
                                }
                            }
                            */
                           fs.readFile(path.join(__dirname, "..", "..", "/templates", "/forgot-password-email.handlebars"), (errorFS, data) => {
                               if(errorFS) {
                                   console.error(errorFS)
                                   response.status(500).send()
                               }
                               else {
                                   var dataString = data.toString()
                                var forgotPasswordTemplate = handlebars.compile(dataString)
                                var resultTemplate = forgotPasswordTemplate(contextObject)
                                //console.log(request.mailer)
                                console.log(result2.rows[0]['email'])
                                request.mailer.sendMail({
                                    from : "YoUni Support <info@support.youni.social>",
                                    to : result2.rows[0]['email'],
                                    subject : "YoUni - Recupero password",
                                    html : resultTemplate
                                }, (errorSM, info) => {
                                    if(errorSM) {
                                        console.error(errorSM)
                                        response.status(500).send()
                                    }
                                    else {
                                        console.log("i: " + info)
                                        response.status(200).send()
                                    }
                                })
                               } 
                           })
                           
                           /*
                            const email = new Email({
                                transport : request.mailer,
                                send : true,
                                preview : false
                            })
                            email.send({
                                template : 'forgotPassword',
                                message : {
                                    from: process.env.RECOVERY_PASSWORD_MAILER_EMAIL,
                                    to: result2.rows[0]['email'],
                                },
                                locals : locals
                            }).then(() => {
                                console.log('Email has been sent!')
                                response.status(200).send()
                        }).catch((err) => {
                            console.error(err)
                            response.status(500).send()
                            })
                            */
                            /*request.mailer.sendMail(data, (error) => {
                                if(error) {
                                    console.error(error)
                                    response.status(500).send()
                                }
                                else {
                                    response.status(200).send('Controlla la mail per resettare la password')
                                }
                            })
                            */
                        }
                    })
                }
                
            })
        }
    })
    
    
}

module.exports = Router().post('/forgotPassword', forgotPassword)