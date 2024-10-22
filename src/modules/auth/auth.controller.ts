import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { name, email, password }: { name: string, email: string, password: string } = registerDto;
    await this.authService.register(name, email, password);

    return res.status(HttpStatus.CREATED).json({
      status: 'Created',
      message: 'User created successfully',
    });  
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { email, password }: { email: string, password: string } = loginDto;
    const { access_token, refresh_token }: { access_token: string, refresh_token: string } = await this.authService.login(email, password);

    res.cookie('refresh_token', refresh_token, { 
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(HttpStatus.OK).json({
      status: 'Ok',
      message: 'User logged in successfully',
      data: { 
        access_token
      },
    });
  }
}
