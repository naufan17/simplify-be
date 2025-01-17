import { Body, Controller, Get, HttpStatus, Ip, Post, Req, Res, Headers, UseGuards } from '@nestjs/common';
import { AuthServiceV1 } from './auth.service.v1';
import { Request, Response } from 'express';
import { AccessJwtAuthGuard } from 'src/common/guard/auth/access-jwt-auth.guard';
import { LocalAuthGuardV1 } from 'src/common/guard/auth/v1/local-auth.guard.v1';
import { RegisterDto } from '../dto/register.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { SignedCookie } from 'src/common/decorators/signed-cookie.decorator';
import { UserId } from 'src/common/decorators/user.decorator';

@Controller({ path: 'auth', version: '1' })
export class AuthControllerV1 {
  constructor(private readonly authService: AuthServiceV1) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto, 
    @Res() res: Response
  ) {
    const { name, email, password }: RegisterDto = registerDto;

    await this.authService.register(name, email, password);

    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
    });  
  }

  @UseGuards(LocalAuthGuardV1)
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
      accessToken: {
        accessToken: string,
        expiresIn: number,
        type: string
      }, 
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
      data: { 
        accessToken: accessToken.accessToken,
        expiresIn: accessToken.expiresIn,
        type: accessToken.type
      }
    });
  }


  @Get('refresh')
  async refreshAccessToken(
    @SignedCookie('refreshToken') sessionId: string, 
    @Ip() ipAddress: string, 
    @Headers('user-agent') userAgent: string, 
    @Res() res: Response
  ) {
    const { accessToken }: { 
      accessToken: {
        accessToken: string,
        expiresIn: number,
        type: string
      }, 
    } = await this.authService.refreshAccessToken(sessionId, ipAddress, userAgent);

    return res.status(HttpStatus.OK).json({ 
      message: 'Access token refreshed successfully',
      statusCode: HttpStatus.OK,
      success: 'Ok',
      data: { 
        accessToken: accessToken.accessToken,
        expiresIn: accessToken.expiresIn,
        type: accessToken.type
      }
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
}
