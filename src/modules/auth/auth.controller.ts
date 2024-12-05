import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AccessJwtAuthGuard } from 'src/common/guard/auth/access-jwt-auth.guard';
import { LocalAuthGuard } from 'src/common/guard/auth/local-auth.guard';
import { ResetJwtAuthGuard } from 'src/common/guard/auth/reset-jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/authenticated-request';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { resetPasswordDto } from './dto/reset-password.dto';
import { OtpDto } from './dto/otp.dto';
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const ipAddress: string | undefined = req.ip;
    const userAgent: string | undefined = req.headers['user-agent'];
    const { accessToken, sessionId }: { accessToken: string, sessionId: string } = await this.authService.login(req.user, ipAddress, userAgent);

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
    const sessionId: string = req.signedCookies['refreshToken'];
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
    const sessionId: string  = req.signedCookies['refreshToken'];

    await this.authService.logout(sessionId);
    res.clearCookie('refreshToken');

    return res.status(HttpStatus.OK).json({
      message: 'User logged out successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK
    });
  }

  @UseGuards(AccessJwtAuthGuard)
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
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Req() req: Request, @Res() res: Response) {
    const { email }: ForgotPasswordDto = forgotPasswordDto;
    const url: string = `${req.protocol}://${req.get('host')}`;
    await this.authService.forgotPassword(email, url);

    return res.status(HttpStatus.OK).json({
      message: 'Password reset link has been sent to your email',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @Get('reset-password')
  async validateResetToken(@Query('token') token: string, @Res() res: Response) {
    await this.authService.validateResetToken(token);

    return res.status(HttpStatus.OK).json({
      message: 'Reset token is valid',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @UseGuards(ResetJwtAuthGuard)
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
