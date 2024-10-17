/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file'

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    })

    const fileTransport = new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-results.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      )
    });

    this.logger = winston.createLogger({
      level: 'info',
      transports: [transport, fileTransport],
    });
  }

  log(message: any) {
    this.logger.info(message);
  }

  error(message: any, trace?: string) {
    this.logger.error(message, trace);
  }

  warn(message: any) {
    this.logger.warn(message);
  }

  debug(message: any) {
    this.logger.debug(message);
  }

  verbose(message: any) {
    this.logger.verbose(message);
  }
}