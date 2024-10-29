/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guard/auth/jwt-auth.guard';
import { User } from './entitiy/user.entity';
import { AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const userId: string = req.user.sub;
    const user: User = await this.userService.getProfile(userId);

    return res.status(HttpStatus.OK).json({
      message: 'User profile fetched successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { user },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getSession(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const userId: string = req.user.sub;
    const session: any = await this.userService.getSession(userId);

    return res.status(HttpStatus.OK).json({
      message: 'User session fetched successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { session },
    });
  }
}
