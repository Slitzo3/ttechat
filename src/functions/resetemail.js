const nodemailer = require("nodemailer");
const crypto = require("crypto");

module.exports = async function resetPasswordEmail(email, account, callback) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SSL, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
  const conf = crypto.randomBytes(10).toString("hex");
  try {
    await transporter.sendMail({
      from: '"TTE Chat" <ttechat@sweplox.se>', // sender address
      to: `${email}`, // list of receivers
      subject: `Activation email for ${account}`, // Subject line
      text: `Reset password for ${account}`, // plain text body
      html: `Reset password email for ${account}, https://ttechat.sweplox.se/activation/${conf}`, // html body
    });
  } catch (err) {
    console.log(err);
  }
  callback({
    conf: conf,
  });
};
