import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessJwtStrategy } from '../../common/strategy/passport/access-jwt.strategy';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { SessionRepository } from './repository/session.repository';
import { Session } from './entity/session.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    JwtModule,
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    AccessJwtStrategy, 
    UserRepository, 
    SessionRepository
  ],
  exports: [
    UserRepository,
    SessionRepository
  ]
})

export class UserModule {}