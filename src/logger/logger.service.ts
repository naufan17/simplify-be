/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file'

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    const transport: transports.ConsoleTransportInstance = new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      )
    })

    const fileTransport = new transports.DailyRotateFile({
      filename: 'logs/%DATE%-results.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    });

    this.logger = createLogger({
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