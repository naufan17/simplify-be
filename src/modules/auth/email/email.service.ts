import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserOtpRepository } from 'src/modules/mailer/repository/user-otp.repository';
import { UserOtp } from 'src/modules/mailer/schema/user-otp.schema';
import { TokenService } from '../token/token.service';
import { MailerService } from 'src/modules/mailer/mailer.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly userOtpRepository: UserOtpRepository,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService
  ) {}

  async sendOtp(userId: string, email: string, subject: string): Promise<boolean> {
    const sendOtp: UserOtp | null = await this.userOtpRepository.findByEmail(email);
    if (sendOtp) return true;

    const otp: number = Math.floor(100000 + Math.random() * 900000);
    const userOtp: UserOtp = await this.userOtpRepository.save(userId, email, otp, new Date());
    if (!userOtp) throw new InternalServerErrorException();

    try {
      await this.mailerService.sendEmailOtp(email, subject, otp.toString());      
    } catch (error) {
      throw new InternalServerErrorException('Error sending email, please try again.');
    }

    return true;
  }

  async sendPasswordResetLink(userId: string, email: string, subject: string, url: string): Promise<boolean> {
    const resetToken: string = this.tokenService.generateResetToken({ sub: userId });
    const resetUrl: string = `${url}/api/v1/auth/reset-password?token=${resetToken}`;

    try {
      await this.mailerService.sendEmailResetPassword(email, subject, resetUrl);
    } catch (error) {
      throw new InternalServerErrorException('Error sending email, please try again.');
    }

    return true;
  }

}
