import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AccessJwtAuthGuard } from '../../common/guard/auth/access-jwt-auth.guard';
import { User } from './entity/user.entity';
import { UserId } from '../../common/decorators/user.decorator'
import { UpdateProfileDto } from './dto/update-profile.dto';

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
  @Post('profile')
  async updateProfile(
    @UserId() userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() res: Response
  ) {
    const { name, email, phoneNumber }: UpdateProfileDto = updateProfileDto;
    await this.userService.updateProfile(userId, name, email, phoneNumber);

    return res.status(HttpStatus.OK).json({
      message: 'User profile updated successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
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
      data: { sessions, meta },    
    });
  }

}
