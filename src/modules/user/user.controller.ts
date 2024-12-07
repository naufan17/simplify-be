/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AccessJwtAuthGuard } from '../../common/guard/auth/access-jwt-auth.guard';
import { User } from './entity/user.entity';
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
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response
  ) {
    const { sessions, meta } = await this.userService.getSession(userId, page, limit);

    return res.status(HttpStatus.OK).json({
      message: 'User session fetched successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { sessions },
      meta,
    });
  }
}
