import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailerService {
  constructor(
    @InjectQueue('emailQueue') 
    private readonly emailQueue: Queue,
  ) {}

  async sendEmailOtp(
    to: string, 
    subject: string, 
    content: string
  ): Promise<void> {
    const templateName: string = 'otp-email';

    try {
      await this.emailQueue.add('sendEmail', { to, subject, templateName, content });
      console.log(`Email job added to queue: ${to}`);
    } catch (error) {
      console.error('Failed to add email job to queue:', error);
    }
  }

  async sendEmailChangePassword(
    to: string, 
    subject: string
  ): Promise<void> {
    const templateName: string = 'change-password-email';

    try {
      await this.emailQueue.add('sendEmail', { to, subject, templateName });
      console.log(`Email job added to queue: ${to}`);
    } catch (error) {
      console.error('Failed to add email job to queue:', error);
    }
  }

  async sendEmailResetPassword(
    to: string, 
    subject: string, 
    content: string
  ): Promise<void> {
    const templateName: string = 'reset-password-email';

    try {
      await this.emailQueue.add('sendEmail', { to, subject, templateName, content });
      console.log(`Email job added to queue: ${to}`);
    } catch (error) {
      console.error('Failed to add email job to queue:', error);
    }
  }
}