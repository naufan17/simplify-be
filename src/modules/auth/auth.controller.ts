import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
// import { LocalAuthGuard } from './guard/local-auth.guard';

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
      message: 'User created successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
    });  
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const { email, password }: { email: string, password: string } = loginDto;
    const ipAddress: string | undefined = req.ip;
    const userAgent: string | undefined = req.headers['user-agent'];
    const { accessToken, refreshToken }: { accessToken: string, refreshToken: string } = await this.authService.login(email, password, ipAddress, userAgent);

    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(HttpStatus.OK).json({
      message: 'User logged in successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { 
        accessToken
      },
    });
    // console.log(req.user);
  }

  @Get('refresh-access-token')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken: string | null = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('Invalid credentials');

    const { accessToken }: { accessToken: string } = await this.authService.refreshAccessToken(refreshToken);

    return res.status(HttpStatus.OK).json({ 
      message: 'Access token refreshed successfully',
      statusCode: HttpStatus.OK,
      success: 'Ok',
      data: {
        accessToken
      }
    });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken: string | null = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('Invalid credentials');

    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');

    return res.status(HttpStatus.OK).json({
      message: 'User logged out successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK
    });
  }
}
