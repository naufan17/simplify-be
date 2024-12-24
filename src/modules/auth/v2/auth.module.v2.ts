import { Module } from '@nestjs/common';
import { AuthServiceV2 } from './auth.service.v2';
import { AuthControllerV2 } from './auth.controller.v2';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../../user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { Session } from '../../user/entity/session.entity';
import { LocalStrategyV2 } from '../../../common/strategy/passport/v2/local.strategy.v2';
import { MongooseModule } from '@nestjs/mongoose';
import { UserOtp, UserOtpSchema } from '../../mailer/schema/user-otp.schema';
import { UserOtpRepository } from '../../mailer/repository/user-otp.repository';
import { AccessJwtStrategy } from 'src/common/strategy/passport/access-jwt.strategy';
import { MailerService } from '../../mailer/mailer.service';
import { QueueModule } from 'src/config/queue/queue.module';
import { EmailService } from './email/email.service';
import { ResetJwtStrategy } from 'src/common/strategy/passport/reset-jwt-strategy';
import { ValidateResetJwtStrategy } from 'src/common/strategy/passport/validate-reset-jwt-strategy';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    MongooseModule.forFeature([{ name: UserOtp.name, schema: UserOtpSchema }]),
    QueueModule,
    JwtModule,
    UserModule
  ],
  controllers: [AuthControllerV2],
  providers: [
    AuthServiceV2, 
    TokenService,
    EmailService,
    MailerService,
    LocalStrategyV2,
    AccessJwtStrategy,
    ResetJwtStrategy,
    ValidateResetJwtStrategy,
    UserOtpRepository, 
  ],
  exports: [UserOtpRepository]
})

export class AuthModuleV2 {}