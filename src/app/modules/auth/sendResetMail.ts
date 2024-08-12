import nodemailer from 'nodemailer';

export async function sendEmail(
  to: string,
  html: string,
  option?: { subject: string },
) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sampodsubroto03@gmail.com',
      pass: 'ayumgkyaqhkflyza',
      // user: config.email,
      // pass: config.appPass,
    },
  });

  await transporter.sendMail({
    from: 'sampodsubroto03@gmail.com', // sender address
    // from: config.email, // sender address
    to, // list of receivers
    subject: option?.subject || 'Reset Password Link', // Subject line
    html, // html body
  });
}
