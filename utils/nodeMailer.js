const nodeMailer = require('nodemailer'); 
require('dotenv').config()

const sendMail = async ( options ) => {
    const transporter = await nodeMailer.createTransport({
        service : "gmail",
        secure: true,
        auth: {
            user: process.env.userEmail,
            pass: process.env.passEmail
        },
        tls:{
            //Bypass SSL verification
            rejectUnauthorized:false,
        }
    });
    const info = await transporter.sendMail( {
        subject: options.subject, 
        text:options.text, 
        from:`"Kristen Hush"<${process.env.userEmail}>`, 
        to:options.email, 
        html:options.html
    })
    console.log("message sent: %s", info.messageId);
    
}
module.exports = sendMail;