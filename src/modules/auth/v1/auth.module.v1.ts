import { Module } from '@nestjs/common';
import { AuthServiceV1 } from './auth.service.v1';
import { AuthControllerV1 } from './auth.controller.v1';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../../user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { Session } from '../../user/entity/session.entity';
import { LocalStrategyV1 } from '../../../common/strategy/passport/v1/local.strategy.v1';
import { AccessJwtStrategy } from 'src/common/strategy/passport/access-jwt.strategy';
import { ResetJwtStrategy } from 'src/common/strategy/passport/reset-jwt-strategy';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    JwtModule,
    UserModule
  ],
  controllers: [AuthControllerV1],
  providers: [
    AuthServiceV1, 
    TokenService,
    LocalStrategyV1,
    AccessJwtStrategy,
    ResetJwtStrategy,
  ],
})

export class AuthModuleV1 {}