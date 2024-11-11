import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailerService {
  constructor(
    @InjectQueue('emailQueue') 
    private readonly emailQueue: Queue
  ) {}

  async sendEmail(to: string, subject: string, otp: string): Promise<void> {
    try {
      await this.emailQueue.add('sendEmail', { to, subject, otp });
      console.log(`Email job added to queue: ${to}`);
    } catch (error) {
      console.error('Failed to add email job to queue:', error);
    }
  }
}