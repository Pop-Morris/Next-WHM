import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ZOHO_MAIL_USERNAME,
      pass: process.env.ZOHO_MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.ZOHO_MAIL_USERNAME, // Using the same email as username
    to,
    subject,
    text,
    html,
  });
} 