/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AccessJwtAuthGuard } from '../../common/guard/auth/access-jwt-auth.guard';
import { User } from './entity/user.entity';
import { AuthenticatedRequest } from 'src/types/authenticated-request';
import { UserId } from '../../common/decorators/user.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('profile')
  async getProfile(
    @UserId() userId: string,
    @Res() res: Response
  ) {
    const user: User = await this.userService.getProfile(userId);

    return res.status(HttpStatus.OK).json({
      message: 'User profile fetched successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { user },
    });
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('session')
  async getSession(
    @UserId() userId: string, 
    @Res() res: Response
  ) {
    const session: any = await this.userService.getSession(userId);

    return res.status(HttpStatus.OK).json({
      message: 'User session fetched successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { session },
    });
  }
}
