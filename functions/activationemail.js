const nodemailer = require('nodemailer');
const crypto = require('crypto');

module.exports = async function activationEmail(email, account, callback) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SSL, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  var conf = crypto.randomBytes(10).toString('hex');
  // send mail with defined transport object
  await transporter.sendMail({
    from: '"TTE Chat" <ttechat@sweplox.se>', // sender address
    to: `${email}`, // list of receivers
    subject: `Activation email for ${account}`, // Subject line
    text: `Activation email for ${account}`, // plain text body
    html: `Activation email for ${account}, https://ttechat.se/activation/${conf}`, // html body
  });
  callback({
    conf,
  });
};
