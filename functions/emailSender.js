const nodemailer = require("nodemailer");

module.exports = {
  emailSender: async (to, subject, content) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.LOCAL_EMAIL_ID,
        pass: process.env.LOCAL_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.LOCAL_EMAIL_ID,
      to,
      subject,
      html: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        const errorMessage = new Error("Error sending email: " + error);
        return errorMessage;
      } else {
        console.log("Email sent: " + info.response);
        return true;
      }
    });
  },
};
