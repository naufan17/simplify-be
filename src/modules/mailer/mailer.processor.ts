import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import path from "path";
import fs from 'fs';
import { Job } from "bullmq";

@Processor('emailQueue')
@Injectable()
export class MailerProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    const { to, subject, otp } = job.data;

    try {
      const transporter: Transporter = createTransport({
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

      const htmlTemplatePath = path.join('templates', 'otp-email.html');
      let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');
      htmlContent = htmlContent.replace('{{ otp }}', otp);

      await transporter.sendMail({
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