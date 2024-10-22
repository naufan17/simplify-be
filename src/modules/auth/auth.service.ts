/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../user/entitiy/user.entity';
import { TokenService } from './token/token.service';
import { SessionRepository } from '../user/session.repository';
import { Session } from '../user/entitiy/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService
  ) {}

  async register(name: string, email: string, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email)
    if (user) throw new ConflictException('User already exists');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const newUser: User = await this.userRepository.save(name, email, hashedPassword);
    if (!newUser) throw new InternalServerErrorException();

    return true;
  }

  async login(email: string, password: string, ipAddress: string | undefined, userAgent: string | undefined): Promise<{ access_token: string, refresh_token: string }> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new ConflictException('User does not exist');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    const accessToken: string = this.tokenService.generateAccessToken({ sub: user.id });
    const refreshToken: string = this.tokenService.generateRefreshToken({ sub: user.id });
    if (!accessToken || !refreshToken) throw new InternalServerErrorException();

    const session: Session = await this.sessionRepository.createSession(user.id, ipAddress, userAgent, new Date());
    if (!session) throw new InternalServerErrorException();

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  async refreshAccessToken(refresh_token: string): Promise<{ access_token: string }> {
    const refreshToken: any = await this.tokenService.verifyRefreshToken(refresh_token);
    if (!refreshToken) throw new UnauthorizedException('Invalid refresh token');

    const accessToken: string = this.tokenService.generateAccessToken({ sub: refreshToken.sub });
    if (!accessToken) throw new InternalServerErrorException();

    return { 
      access_token: accessToken 
    };
  }
}
