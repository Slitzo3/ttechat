const nodemailer = require('nodemailer');
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SSL, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

   let account = "Tooxic"
   let email = "albin@sweplox.se"
   var crypto = require("crypto");
   var conf = crypto.randomBytes(10).toString('hex');
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"TTE Chat" <ttechat@sweplox.se>', // sender address
    to: `${email}`, // list of receivers
    subject: `Activation email for ${account}`, // Subject line
    text: `Reset password for ${account}`, // plain text body
    html: `Reset password email for ${account}, https://ttechat.sweplox.se/activation/${conf}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);