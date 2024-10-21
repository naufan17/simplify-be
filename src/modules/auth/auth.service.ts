/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(name: string, email: string, password: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email)
    if (user) throw new ConflictException('User already exists');

    const hashedPassword: string = await bcrypt.hash(password, 10);
    await this.userRepository.save(name, email, hashedPassword);

    return true;
  }

  async login(email: string, password: string): Promise<string> {
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) throw new ConflictException('User does not exist');

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    if (isPasswordValid === false) throw new UnauthorizedException('Invalid password');

    if (user && isPasswordValid) {
      const access_token = this.jwtService.sign({
        email: user.email,
        sub: user.id
      }, {
        secret: process.env.JWT_SECRET_ACCESS_TOKEN,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
      });

      return access_token;

    } else {
      throw new UnauthorizedException();
    }
  }

}
