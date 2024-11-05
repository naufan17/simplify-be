/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../user/entitiy/user.entity';
import { TokenService } from './token/token.service';
import { SessionRepository } from '../user/repository/session.repository';
import { Session } from '../user/entitiy/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService
  ) {}

  async register(name: string, email: string, phoneNumber: string, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email)
    if (user) throw new ConflictException('User already exists');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const newUser: User = await this.userRepository.save(name, email, phoneNumber, hashedPassword);
    if (!newUser) throw new InternalServerErrorException();

    return true;
  }

  async login(email: string, password: string, ipAddress: string | undefined, userAgent: string | undefined): Promise<{ accessToken: string, refreshToken: string }> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    const accessToken: string = this.tokenService.generateAccessToken({ sub: user.id });
    const refreshToken: string = this.tokenService.generateRefreshToken({ sub: user.id });
    if (!accessToken || !refreshToken) throw new InternalServerErrorException();

    const session: Session = await this.sessionRepository.createSession(user.id, refreshToken, ipAddress, userAgent, new Date(), new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    if (!session) throw new InternalServerErrorException();

    return { accessToken, refreshToken }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const refreshTokenPayload: any = await this.tokenService.verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) throw new UnauthorizedException('Invalid refresh token');

    const session: Session | null = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException('Invalid refresh token');
    if (session.expiresAt < new Date()) throw new UnauthorizedException('Refresh token expired');

    const sessionUpdate: any = await this.sessionRepository.updateSession(refreshToken, new Date());
    if (!sessionUpdate) throw new InternalServerErrorException();

    const accessToken: string = this.tokenService.generateAccessToken({ sub: refreshTokenPayload.sub });
    if (!accessToken) throw new InternalServerErrorException();

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<boolean> {
    const session: Session | null = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException('Invalid refresh token');

    const sessionExpire: any = this.sessionRepository.endSession(refreshToken, new Date());
    if (!sessionExpire) throw new InternalServerErrorException();

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
  
  async forgotPassword(email: string) {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User does not exist');

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save to DB

    return otp;
  }

  async resetPassword(newPassword: string) {
    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    // Cek in the DB
    // Update DB

    return true;
  }

  async verifyOtp(otp: number) {
    // Verify OTP is valid

    const resetToken: string = await this.tokenService.generateAccessToken({ sub: otp });
    if (!resetToken) throw new InternalServerErrorException();

    return resetToken
  }
}
