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

  async register(name: string, email: string, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email)
    if (user) throw new ConflictException('User already exists');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    if (!hashedPassword) throw new InternalServerErrorException();

    const newUser: User = await this.userRepository.save(name, email, hashedPassword);
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

    const sessionExpire: Session | null = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!sessionExpire) throw new UnauthorizedException('Invalid refresh token');
    if (sessionExpire.expireAt < new Date()) throw new UnauthorizedException('Refresh token expired');

    const session: Session = await this.sessionRepository.updateSession(refreshToken, new Date());
    if (!session) throw new InternalServerErrorException();

    const accessToken: string = this.tokenService.generateAccessToken({ sub: refreshTokenPayload.sub });
    if (!accessToken) throw new InternalServerErrorException();

    return { accessToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new ConflictException('User does not exist');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    if (user && isPasswordValid === true) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
