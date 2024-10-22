import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/entitiy/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { TokenService } from './token/token.service';
import { Session } from '../user/entitiy/session.entity';
import { SessionRepository } from '../user/session.repository';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    JwtModule,
  ],
  providers: [AuthService, TokenService, UserRepository, SessionRepository],
  controllers: [AuthController]
})
export class AuthModule {}
