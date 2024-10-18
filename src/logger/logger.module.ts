import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level}]: ${message}`;
            })
          )
        }),
        new DailyRotateFile({
          filename: 'logs/%DATE%-results.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp(),
            format.json()
          )
        })
      ]
    })
  ],
})

export class LoggerModule {}
