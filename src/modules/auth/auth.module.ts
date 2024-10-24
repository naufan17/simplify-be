import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/entitiy/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token/token.service';
import { Session } from '../user/entitiy/session.entity';
import { LocalStrategy } from '../../common/strategy/passport/local.strategy';
import { SessionRepository } from '../user/repository/session.repository';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, LocalStrategy, SessionRepository, UserRepository],
})

export class AuthModule {}