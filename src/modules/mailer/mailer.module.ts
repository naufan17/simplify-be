import { Module } from '@nestjs/common';
import { QueueModule } from 'src/config/queue/queue.module';
import { UserOtpRepository } from './repository/user-otp.repository';
import { MailerService } from './mailer.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    QueueModule,
    AuthModule
  ],
  providers: [MailerService],
})

export class MailerModule {}
