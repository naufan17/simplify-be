import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      signOptions: { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES 
      },
    }),
  ],
  providers: [AuthService, UserRepository],
  controllers: [AuthController]
})
export class AuthModule {}
