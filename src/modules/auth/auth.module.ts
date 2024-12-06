import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token/token.service';
import { Session } from '../user/entity/session.entity';
import { LocalStrategy } from '../../common/strategy/passport/local.strategy';
import { SessionRepository } from '../user/repository/session.repository';
import { UserRepository } from '../user/repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserOtp, UserOtpSchema } from '../mailer/schema/user-otp.schema';
import { UserOtpRepository } from '../mailer/repository/user-otp.repository';
import { AccessJwtStrategy } from 'src/common/strategy/passport/access-jwt.strategy';
import { MailerService } from '../mailer/mailer.service';
import { QueueModule } from 'src/config/queue/queue.module';
import { EmailService } from './email/email.service';
import { ResetJwtStrategy } from 'src/common/strategy/passport/reset-jwt-strategy';
import { ValidateResetJwtStrategy } from 'src/common/strategy/passport/validate-reset-jwt-strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    MongooseModule.forFeature([{ name: UserOtp.name, schema: UserOtpSchema }]),
    QueueModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    TokenService,
    EmailService,
    MailerService,
    LocalStrategy,
    AccessJwtStrategy,
    ResetJwtStrategy,
    ValidateResetJwtStrategy,
    SessionRepository, 
    UserRepository, 
    UserOtpRepository, 
  ],
})

export class AuthModule {}