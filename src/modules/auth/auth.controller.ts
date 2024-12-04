import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { resetPasswordDto } from './dto/reset-password.dto';
import { OtpDto } from './dto/otp.dto';
// import { LocalAuthGuard } from '../../common/guard/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guard/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/authenticated-request';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { name, email, phoneNumber, password }: RegisterDto = registerDto;
    await this.authService.register(name, email, phoneNumber, password);

    return res.status(HttpStatus.CREATED).json({
      message: [
        'User created successfully', 
        'Verify your email to login', 'OTP sent to your email'
      ],
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
    const { accessToken, sessionId }: { accessToken: string, sessionId: string } = await this.authService.login(email, password, ipAddress, userAgent);

    res.cookie('refreshToken', sessionId, { 
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(HttpStatus.OK).json({
      message: 'User logged in successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { accessToken },
    });
  }

  @Post('verify-email')
  async verifyEmail(@Body() otpDto: OtpDto, @Res() res: Response) {
    const { otp }: OtpDto = otpDto;
    await this.authService.verifyEmail(otp);

    return res.status(HttpStatus.OK).json({
      message: 'Email verified successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @Get('refresh')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const ipAddress: string | undefined = req.ip;
    const userAgent: string | undefined = req.headers['user-agent'];
    const sessionId: string | null = req.signedCookies['refreshToken'];
    if (!sessionId) throw new UnauthorizedException('Invalid credentials');

    const accessToken: string = await this.authService.refreshAccessToken(sessionId, ipAddress, userAgent);

    return res.status(HttpStatus.OK).json({ 
      message: 'Access token refreshed successfully',
      statusCode: HttpStatus.OK,
      success: 'Ok',
      data: { accessToken }
    });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const sessionId: string = req.signedCookies['refreshToken'];
    if (!sessionId) throw new UnauthorizedException('Invalid credentials');

    await this.authService.logout(sessionId);
    res.clearCookie('refreshToken');

    return res.status(HttpStatus.OK).json({
      message: 'User logged out successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: AuthenticatedRequest,  @Res() res: Response) {
    const userId: string = req.user.sub;
    const sessionId: string = req.signedCookies['refreshToken'];
    const { oldPassword, newPassword }: ChangePasswordDto = changePasswordDto;

    await this.authService.changePassword(sessionId, userId, oldPassword, newPassword);
    res.clearCookie('refreshToken');

    return res.status(HttpStatus.OK).json({
      message: [
        'Password changed successfully', 
        'Please login with new password'
      ],
      success: 'Ok',
      statusCode: HttpStatus.OK
    })
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Res() res: Response) {
    const { email }: ForgotPasswordDto = forgotPasswordDto;
    await this.authService.forgotPassword(email);

    return res.status(HttpStatus.OK).json({
      message: 'OTP sent to your email',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: OtpDto, @Res() res: Response) {
    const { otp }: OtpDto = otpDto;
    const accessToken: string = await this.authService.verifyOtp(otp);

    return res.status(HttpStatus.OK).json({
      message: 'OTP verified successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { accessToken }
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
}
