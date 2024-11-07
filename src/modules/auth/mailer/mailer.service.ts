import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import path from 'path';
import fs from 'fs';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT ?? '587', 10),
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }); 
  }

  async sendEmail(to: string, subject: string, otp: string): Promise<void> {
    try {
      const htmlTemplatePath = path.join('templates', 'otp-email.html');
      let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');
      htmlContent = htmlContent.replace('{{ otp }}', otp);

      await this.transporter.sendMail({
        from: '"Simplify" <simplify@demomailtrap.com>',
        to,
        subject,
        html: htmlContent
      });

      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}