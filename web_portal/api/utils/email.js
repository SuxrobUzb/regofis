const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Замените на ваш SMTP-сервер
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-email-password',
  },
});

const send2FACode = async (to, code) => {
  const mailOptions = {
    from: 'your-email@example.com',
    to,
    subject: 'Ваш код двухфакторной аутентификации',
    text: `Ваш код: ${code}. Действителен в течение 5 минут.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { send2FACode };