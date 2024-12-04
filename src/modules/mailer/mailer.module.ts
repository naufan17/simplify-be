import { Module } from '@nestjs/common';
import { QueueModule } from 'src/config/queue/queue.module';

@Module({
  imports: [QueueModule]
})
export class MailerModule {}
