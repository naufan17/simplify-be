import { Module } from '@nestjs/common';
import { QueueModule } from 'src/config/queue/queue.module';
import { MailerService } from './mailer.service';
import { AuthModuleV2 } from '../auth/v2/auth.module.v2';

@Module({
  imports: [
    QueueModule,
    AuthModuleV2
  ],
  providers: [MailerService],
})

export class MailerModule {}
