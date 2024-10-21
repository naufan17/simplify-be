import { Body, Controller, HttpStatus, Inject, LoggerService, Post, Res } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) 
    private readonly logger: LoggerService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { name, email, password } = registerDto;
    const result: boolean = await this.authService.register(name, email, password);

    if (result === true) {
      return res.status(HttpStatus.CREATED).json({
        status: 'Success',
        message: 'User created successfully',
      });  
    } else {
      return res.status(HttpStatus.CONFLICT).json({
        status: 'Failed',
        message: 'User already exists',
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { email, password } = loginDto;
    const result: string = await this.authService.login(email, password);

    if (result) {
      return res.status(HttpStatus.OK).json({
        status: 'Success',
        message: 'User logged in successfully',
        data: { 
          access_token: result
        },
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'Failed',
        message: 'Invalid email or password',
      });
    }
  }
}
