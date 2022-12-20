import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const EmailAdapter = {
  async sendEmail(
    email: string,
    code: string,
    subject: string,
  ) : Promise<SMTPTransport.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'romansenderbackend@gmail.com',
        pass: 'cpluorevopiuubxt',
      },
    });
    return await transporter.sendMail({
      from: 'Roman <romansenderbackend@gmail.com>',
      to: email,
      subject,
      html: `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href="https://somesite.com/confirm-email?code=' + ${code} + '">complete registration</a>
      </p>`,
    });
  },
};
