import { Body, Controller, Get, HttpStatus, Ip, Post, Req, Res, Headers, UseGuards } from '@nestjs/common';
import { AuthServiceV2 } from './auth.service.v2';
import { Request, Response } from 'express';
import { AccessJwtAuthGuard } from 'src/common/guard/auth/access-jwt-auth.guard';
import { LocalAuthGuardV2 } from 'src/common/guard/auth/v2/local-auth.guard.v2';
import { ResetJwtAuthGuard } from 'src/common/guard/auth/reset-jwt-auth.guard';
import { RegisterDto } from '../dto/register.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { resetPasswordDto } from '../dto/reset-password.dto';
import { OtpDto } from '../dto/otp.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ValidateResetJwtAuthGuard } from 'src/common/guard/auth/validate-reset-jwt-auth.guard';
import { SignedCookie } from 'src/common/decorators/signed-cookie.decorator';
import { UserId } from 'src/common/decorators/user.decorator';

@Controller({ path: 'auth', version: '2' })
export class AuthControllerV2 {
  constructor(private readonly authService: AuthServiceV2) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto, 
    @Res() res: Response
  ) {
    const { name, email, password }: RegisterDto = registerDto;

    await this.authService.register(name, email, password);

    return res.status(HttpStatus.CREATED).json({
      message: [
        'User created successfully', 
        'Verify your email to login', 
        'OTP sent to your email'
      ],
      success: 'Created',
      statusCode: HttpStatus.CREATED,
    });  
  }

  @UseGuards(LocalAuthGuardV2)
  @Post('login')
  async login(
    @Ip() ipAddress: string, 
    @Headers('user-agent') userAgent: string, 
    @Req() req: Request, 
    @Res() res: Response
  ) {
    const { 
      accessToken, 
      sessionId 
    }: { 
      accessToken: string, 
      sessionId: string 
    } = await this.authService.login(req.user, ipAddress, userAgent);

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
  async verifyEmail(
    @Body() otpDto: OtpDto, 
    @Res() res: Response
  ) {
    const { otp }: OtpDto = otpDto;

    await this.authService.verifyEmail(otp);

    return res.status(HttpStatus.OK).json({
      message: 'Email verified successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @Get('refresh')
  async refreshAccessToken(
    @SignedCookie('refreshToken') sessionId: string, 
    @Ip() ipAddress: string, 
    @Headers('user-agent') userAgent: string, 
    @Res() res: Response
  ) {
    const accessToken: string = await this.authService.refreshAccessToken(sessionId, ipAddress, userAgent);

    return res.status(HttpStatus.OK).json({ 
      message: 'Access token refreshed successfully',
      statusCode: HttpStatus.OK,
      success: 'Ok',
      data: { accessToken }
    });
  }

  @Get('logout')
  async logout(
    @SignedCookie('refreshToken') sessionId: string, 
    @Res() res: Response
  ) {
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
  async changePassword(
    @SignedCookie('refreshToken') sessionId: string, 
    @UserId() userId: string, 
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response
  ) {
    const { password }: ChangePasswordDto = changePasswordDto;

    await this.authService.changePassword(sessionId, userId, password);
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
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto, 
    @Req() req: Request, 
    @Res() res: Response
  ) {
    const { email }: ForgotPasswordDto = forgotPasswordDto;
    const url: string = `${req.protocol}://${req.get('host')}`;
    await this.authService.forgotPassword(email, url);

    return res.status(HttpStatus.OK).json({
      message: 'Password reset link has been sent to your email',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @UseGuards(ValidateResetJwtAuthGuard)
  @Get('reset-password')
  async validateResetToken(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: 'Reset token is valid',
      success: 'Ok',
      statusCode: HttpStatus.OK,
    });
  }

  @UseGuards(ResetJwtAuthGuard)
  @Post('reset-password')
  async resetPassword(
    @UserId() userId: string, 
    @Body() resetPasswordDto: resetPasswordDto,
    @Res() res: Response
  ) {
    const { password }: resetPasswordDto = resetPasswordDto;
    await this.authService.resetPassword(userId, password);

    return res.status(HttpStatus.OK).json({
      message: 'Password reset successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK
    });
  }
}
