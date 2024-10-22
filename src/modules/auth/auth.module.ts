import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule,
  ],
  providers: [AuthService, UserRepository, TokenService],
  controllers: [AuthController]
})
export class AuthModule {}
