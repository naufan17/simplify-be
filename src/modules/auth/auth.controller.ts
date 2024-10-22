import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express'

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
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const { email, password }: { email: string, password: string } = loginDto;
    const ipAddress: string | undefined = req.ip;
    const userAgent: string | undefined = req.headers['user-agent'];
    const { access_token, refresh_token }: { access_token: string, refresh_token: string } = await this.authService.login(email, password, ipAddress, userAgent);

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

  @Get('refresh-access-token')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refresh_token: string = req.cookies['refresh_token'];
    const { access_token }: { access_token: string } = await this.authService.refreshAccessToken(refresh_token);

    return res.status(HttpStatus.OK).json({ 
      status: 'Ok',
      message: 'Access token refreshed successfully',
      data: {
        access_token
      }
    });
  }
}
