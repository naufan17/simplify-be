import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { resetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { LocalAuthGuard } from '../../common/guard/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guard/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { name, email, phoneNumber, password }: RegisterDto = registerDto;
    await this.authService.register(name, email, phoneNumber, password);

    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
    });  
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const { email, password }: LoginDto = loginDto;
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
      data: { accessToken },
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
      data: { accessToken }
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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Req() req: Request, @Res() res: Response) {
    const { email }: ForgotPasswordDto = forgotPasswordDto;
    await this.authService.forgotPassword(email);

    return res.status(HttpStatus.OK).json({
      message: 'OTP sent to your email',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: resetPasswordDto, @Req() req: AuthenticatedRequest,  @Res() res: Response) {
    const userId: string = req.user.sub;
    const { password }: resetPasswordDto = resetPasswordDto;
    await this.authService.resetPassword(userId, password);

    return res.status(HttpStatus.OK).json({
      message: 'Password reset successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK
    });
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Req() req: Request, @Res() res: Response) {
    const { otp }: VerifyOtpDto = verifyOtpDto;
    const accessToken: string = await this.authService.verifyOtp(otp);

    return res.status(HttpStatus.OK).json({
      message: 'OTP verified successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { accessToken }
    });
  }
}
