/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../user/repository/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../../user/entity/user.entity';
import { TokenService } from '../token/token.service';
import { SessionRepository } from '../../user/repository/session.repository';
import { Session } from '../../user/entity/session.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async register(
    name: string, 
    email: string, 
    phoneNumber: string | undefined, 
    password: string
  ): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email)
    if (user) throw new ConflictException('User already exists');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const newUser: User = await this.userRepository.save(name, email, phoneNumber, hashedPassword);
    if (!newUser) throw new InternalServerErrorException();

    return true;
  }

  async login(
    user: any, 
    ipAddress: string | undefined, 
    userAgent: string | undefined
  ): Promise<{ 
    accessToken: string, 
    sessionId: string 
  }> {
    const sessionEnd: any = await this.sessionRepository.endAllSessions(user.id);
    if (!sessionEnd) throw new InternalServerErrorException();

    const accessToken: string = this.tokenService.generateAccessToken({ sub: user.id });
    const sessionId: string = randomBytes(16).toString('hex');
    if (!accessToken || !sessionId) throw new InternalServerErrorException();

    const session: Session = await this.sessionRepository.createSession(user.id, sessionId, ipAddress, userAgent, new Date(), new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    if (!session) throw new InternalServerErrorException();

    return { accessToken, sessionId }
  }

  async refreshAccessToken(
    sessionId: string, 
    ipAddress: string | undefined, 
    userAgent: string | undefined
  ): Promise<string> { 
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

  async changePassword(
    sessionId: string, 
    userId: string, 
    oldPassword: string, 
    newPassword: string
  ): Promise<boolean> {
    const user: User | null = await this.userRepository.findPasswordById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    const isPasswordValid: boolean = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const userUpdate: User = await this.userRepository.updatePassword(userId, hashedPassword);
    if (!userUpdate) throw new InternalServerErrorException();

    await this.logout(sessionId);

    return true;
  }
  
  async validateUser(
    email: string, 
    password: string
  ): Promise<any> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
