/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../user/entitiy/user.entity';
import { TokenService } from './token/token.service';
import { SessionRepository } from '../user/repository/session.repository';
import { Session } from '../user/entitiy/session.entity';
import { UserOtpRepository } from './repository/user-otp.repository';
import { UserOtp } from './schema/user-otp.schema';
import { MailerService } from './mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userOtpRepository: UserOtpRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService
  ) {}

  async register(name: string, email: string, phoneNumber: string, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email)
    if (user) throw new ConflictException('User already exists');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const newUser: User = await this.userRepository.save(name, email, phoneNumber, hashedPassword);
    if (!newUser) throw new InternalServerErrorException();

    await this.sendEmailOtp(newUser.id, newUser.email, 'Verify Email');

    return true;
  }

  async login(email: string, password: string, ipAddress: string | undefined, userAgent: string | undefined): Promise<{ accessToken: string, refreshToken: string }> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified === false) {
      await this.sendEmailOtp(user.id, user.email, 'Verify Email');
  
      throw new UnauthorizedException('User is not verified, check your email to verify');
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    const accessToken: string = this.tokenService.generateAccessToken({ sub: user.id });
    const refreshToken: string = this.tokenService.generateRefreshToken({ sub: user.id });
    if (!accessToken || !refreshToken) throw new InternalServerErrorException();

    const session: Session = await this.sessionRepository.createSession(user.id, refreshToken, ipAddress, userAgent, new Date(), new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    if (!session) throw new InternalServerErrorException();

    return { accessToken, refreshToken }
  }

  async verifyEmail(otp: number): Promise<boolean> {
    const userOtp: UserOtp | null = await this.userOtpRepository.findByOtp(otp);
    if (!userOtp) throw new NotFoundException('Invalid OTP');

    const isVerified: any = await this.userRepository.updateIsVerified(userOtp.userId, true);
    if (!isVerified) throw new InternalServerErrorException();

    return true;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> { 
    const refreshTokenPayload: any = this.tokenService.verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) throw new UnauthorizedException('Invalid refresh token');

    const session: Session | null = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException('Invalid refresh token');
    if (session.expiresAt < new Date()) throw new UnauthorizedException('Refresh token expired');

    const sessionUpdate: any = await this.sessionRepository.updateSession(refreshToken, new Date());
    if (!sessionUpdate) throw new InternalServerErrorException();

    const accessToken: string = this.tokenService.generateAccessToken({ sub: refreshTokenPayload.sub });
    if (!accessToken) throw new InternalServerErrorException();

    return accessToken;
  }

  async logout(refreshToken: string): Promise<boolean> {
    const session: Session | null = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException('Invalid refresh token');

    const sessionExpire: any = this.sessionRepository.endSession(refreshToken, new Date());
    if (!sessionExpire) throw new InternalServerErrorException();

    return true;
  }
  
  async forgotPassword(email: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User does not exist');

    await this.sendEmailOtp(user.id, user.email, 'Reset Password');

    return true;
  }

  async resetPassword(userId: string, Password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const hashedPassword: string = await bcrypt.hash(Password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const userUpdate: User = await this.userRepository.updatePassword(userId, hashedPassword);
    if (!userUpdate) throw new InternalServerErrorException();

    return true;
  }

  async verifyOtp(otp: number): Promise<string> {
    const userOtp: UserOtp | null = await this.userOtpRepository.findByOtp(otp);
    if (!userOtp) throw new NotFoundException('Invalid OTP');

    const accessToken: string = this.tokenService.generateAccessToken({ sub: userOtp.userId });
    if (!accessToken) throw new InternalServerErrorException();

    return accessToken;
  }

  async sendEmailOtp(userId: string, email: string, subject: string): Promise<boolean> {
    const otp: number = Math.floor(100000 + Math.random() * 900000);
    const userOtp: UserOtp = await this.userOtpRepository.save(userId, email, otp, new Date());
    if (!userOtp) throw new InternalServerErrorException();

    await this.mailerService.sendEmail(email, subject, otp.toString());

    return true;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User does not exist');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    if (user && isPasswordValid === true) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
