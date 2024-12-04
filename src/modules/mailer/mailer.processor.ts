import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import path from "path";
import fs from 'fs';
import { Job } from "bullmq";

@Processor('emailQueue')
@Injectable()
export class MailerProcessor extends WorkerHost {
  private transporter: Transporter;

  constructor() {
    super();
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

  private loadTemplate(templateName: string, content: string | null): string {
    const templatePath = path.join('templates', `${templateName}.html`);
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    if (content) htmlContent = htmlContent.replace('{{ otp }}', content);

    return htmlContent;
  }

  async process(job: Job): Promise<void> {
    const { to, subject, templateName, content } = job.data;

    try {
      const htmlContent = this.loadTemplate(templateName, content);

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