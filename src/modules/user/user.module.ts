import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../common/strategy/passport/jwt.strategy';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitiy/user.entity';
import { SessionRepository } from './repository/session.repository';
import { Session } from './entitiy/session.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    JwtModule,
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    JwtStrategy, 
    UserRepository, 
    SessionRepository
  ],
})

export class UserModule {}