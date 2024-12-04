import { Module } from '@nestjs/common';
import { QueueModule } from 'src/config/queue/queue.module';
import { UserOtpRepository } from './repository/user-otp.repository';
import { MailerService } from './mailer.service';

@Module({
  imports: [QueueModule],
  providers: [
    UserOtpRepository, 
    MailerService
  ],
})

export class MailerModule {}
