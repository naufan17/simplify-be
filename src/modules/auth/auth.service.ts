/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../user/entity/user.entity';
import { TokenService } from './token/token.service';
import { SessionRepository } from '../user/repository/session.repository';
import { Session } from '../user/entity/session.entity';
import { UserOtpRepository } from '../mailer/repository/user-otp.repository';
import { UserOtp } from '../mailer/schema/user-otp.schema';
import { MailerService } from '../mailer/mailer.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userOtpRepository: UserOtpRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService
  ) {}

  async register(name: string, email: string, phoneNumber: string | undefined, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email)
    if (user) throw new ConflictException('User already exists');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const newUser: User = await this.userRepository.save(name, email, phoneNumber, hashedPassword);
    if (!newUser) throw new InternalServerErrorException();

    await this.sendOtp(newUser.id, newUser.email, 'Verify Email');

    return true;
  }

  async login(email: string, password: string, ipAddress: string | undefined, userAgent: string | undefined): Promise<{ accessToken: string, sessionId: string }> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    if (user.isVerified === false) {
      await this.sendOtp(user.id, user.email, 'Verify Email');
      throw new UnauthorizedException('User is not verified, check your email to verify');
    }

    const sessionEnd: any = await this.sessionRepository.endAllSessions(user.id);
    if (!sessionEnd) throw new InternalServerErrorException();

    const accessToken: string = this.tokenService.generateAccessToken({ sub: user.id });
    const sessionId: string = randomBytes(16).toString('hex');
    if (!accessToken || !sessionId) throw new InternalServerErrorException();

    const session: Session = await this.sessionRepository.createSession(user.id, sessionId, ipAddress, userAgent, new Date(), new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    if (!session) throw new InternalServerErrorException();

    return { accessToken, sessionId }
  }

  async verifyEmail(otp: number): Promise<boolean> {
    const userOtp: UserOtp | null = await this.userOtpRepository.findByOtp(otp);
    if (!userOtp) throw new UnauthorizedException('Invalid OTP');

    const isVerified = await this.userRepository.updateIsVerified(userOtp.userId, true);
    if (!isVerified) throw new InternalServerErrorException();

    return true;
  }

  async refreshAccessToken(sessionId: string, ipAddress: string | undefined, userAgent: string | undefined) { 
    const session: Session | null = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) throw new UnauthorizedException('Invalid refresh token');
    if (session.expiresAt < new Date()) throw new UnauthorizedException('Refresh token expired');
    if (session.ipAddress !== ipAddress || session.userAgent !== userAgent) throw new UnauthorizedException('Invalid credentials');

    const sessionUpdate: any = await this.sessionRepository.updateSession(sessionId, new Date());
    if (!sessionUpdate) throw new InternalServerErrorException();

    const accessToken: string = this.tokenService.generateAccessToken({ sub: session.user.id });
    if (!accessToken) throw new InternalServerErrorException();

    return accessToken;
  }

  async logout(sessionId: string): Promise<boolean> {
    const session: Session | null = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) throw new UnauthorizedException('Invalid refresh token');

    const sessionExpire: any = this.sessionRepository.endSession(sessionId, new Date());
    if (!sessionExpire) throw new InternalServerErrorException();

    return true;
  }

  async changePassword(sessionId: string, userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findPasswordById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    const isPasswordValid: boolean = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const userUpdate: User = await this.userRepository.updatePassword(userId, hashedPassword);
    if (!userUpdate) throw new InternalServerErrorException();

    await this.mailerService.sendEmailChangePassword(user.email, 'Change Password');
    await this.logout(sessionId);

    return true;
  }
  
  async forgotPassword(email: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User does not exist');

    await this.sendOtp(user.id, user.email, 'Reset Password');

    return true;
  }

  async verifyOtp(otp: number): Promise<string> {
    const userOtp: UserOtp | null = await this.userOtpRepository.findByOtp(otp);
    if (!userOtp) throw new UnauthorizedException('Invalid OTP');

    const accessToken: string = this.tokenService.generateAccessToken({ sub: userOtp.userId });
    if (!accessToken) throw new InternalServerErrorException();

    return accessToken;
  }

  async resetPassword(userId: string, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const userUpdate: User = await this.userRepository.updatePassword(userId, hashedPassword);
    if (!userUpdate) throw new InternalServerErrorException();

    return true;
  }

  async sendOtp(userId: string, email: string, subject: string): Promise<boolean> {
    const sendOtp: UserOtp | null = await this.userOtpRepository.findByEmail(email);
    if (sendOtp) return true;

    const otp: number = Math.floor(100000 + Math.random() * 900000);
    const userOtp: UserOtp = await this.userOtpRepository.save(userId, email, otp, new Date());
    if (!userOtp) throw new InternalServerErrorException();

    await this.mailerService.sendEmailOtp(email, subject, otp.toString());

    return true;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    if (user.isVerified === false) {
      await this.sendOtp(user.id, user.email, 'Verify Email');
      throw new UnauthorizedException('User is not verified, check your email to verify');
    }

    if (user && isPasswordValid === true && user.isVerified === true) return user

    return null;
  }
}
