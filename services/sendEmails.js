const { validationResult } = require("express-validator");
const Flag = require("../Models/Flag");
const sgMail = require("@sendgrid/mail");

exports.sendEmail = (req, res, next) => {
  // #swagger.tags = ['Email']
  // #swagger.description = '<Manda email'

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "gfelicio199@gmail.com", // Change to your recipient
    from: "guifelicio7@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
