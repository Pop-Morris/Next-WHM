import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  // Validate environment variables
  if (!process.env.ZOHO_MAIL_USERNAME || !process.env.ZOHO_MAIL_PASSWORD) {
    console.error('Missing email configuration. Please check ZOHO_MAIL_USERNAME and ZOHO_MAIL_PASSWORD environment variables.');
    throw new Error('Email configuration missing');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZOHO_MAIL_USERNAME,
      pass: process.env.ZOHO_MAIL_PASSWORD,
    }
  });

  try {
    const result = await transporter.sendMail({
      from: process.env.ZOHO_MAIL_USERNAME,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 