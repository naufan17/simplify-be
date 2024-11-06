import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'live.smtp.mailtrap.io',
      port: 587,
      secure: false,
      auth: {
        user: 'smtp@mailtrap.io',
        pass: 'dc941a212822bef24b16c3308c88cddb'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: 'hello@demomailtrap.com',
        to,
        subject,
        text
      });

      console.log(`Email sent to ${to} with message: ${text}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
