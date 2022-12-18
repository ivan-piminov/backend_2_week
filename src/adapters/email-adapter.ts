import nodemailer from 'nodemailer';

export const EmailAdapter = {
  async sendEmail(email: string, message: string, subject: string) {
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
          <a href=https://somesite.com/confirm-email?code=${message}'>complete registration</a>
      </p>`,
    });
  },
};
