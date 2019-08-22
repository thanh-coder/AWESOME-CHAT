import nodeMailer from 'nodemailer';
var smtpTransport = require('nodemailer-smtp-transport');
let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;

let sendMail = (to,subject,htmlContent) => {
    console.log(to)
    let transporter = nodeMailer.createTransport({
        host:mailHost,
        port:587,
        secure: true,
        auth:{
            user:adminEmail,
            pass: adminPassword
        }
    })
    let option = {
        from: adminEmail,
        to,
        subject,
        html: htmlContent
    }
    return transporter.sendMail(option);
}

module.exports = sendMail;