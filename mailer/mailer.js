
const nodemailer = require('nodemailer')
const path = require('path')
const mailgun = require('nodemailer-mailgun-transport')

var email = process.env.RECOVERY_PASSWORD_MAILER_EMAIL
var pass = process.env.RECOVERY_PASSWORD_MAILER_PASSWORD

var auth = {
    auth : {
        api_key: '3389f89cc12f61cd2ff7ca4e9a0892d9-af6c0cec-bcdfd29b',
        domain : 'support.youni.social' //'https://api.eu.mailgun.net/v3/support.youni.social'
    },
    host : "api.eu.mailgun.net"
}

var nodemailerMailgun = nodemailer.createTransport(mailgun(auth))

module.exports = nodemailerMailgun

/*

var smtpTransport = nodemailer.createTransport({
    service: process.env.RECOVERY_PASSWORD_MAILER_PROVIDER,
    auth: {
        user : email,
        pass : pass
    }
});




module.exports = smtpTransport;
*/