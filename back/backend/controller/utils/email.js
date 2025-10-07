import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();
export async function sendVerificationEmail(user) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const url = `http://localhost:3000/auth/verify/${user.verifyToken}`;

  await transporter.sendMail({
    from: '"FlowCom" <no-reply@gmail.com>',
    to: user.email,
    subject: "Vérification de votre email",
    html: `Cliquez <a href="${url}">ici</a> pour vérifier votre compte.`
  });
}
