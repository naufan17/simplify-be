import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          level: 'info',
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level}]: ${message}`;
            })
          )
        }),
        new DailyRotateFile({
          level: 'info',
          filename: 'logs/info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp(),
            format.json()
          )
        }),
        new DailyRotateFile({
          level: 'error',
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp(),
            format.json()
          )
        }),
      ]
    })
  ],
})

export class LoggerModule {}
