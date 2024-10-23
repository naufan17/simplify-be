import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from './entitiy/user.entity';
import { Session } from './entitiy/session.entity';
// import { User } from './entitiy/user.entity';

interface AuthenticatedRequest extends Request {
  user: { sub: string };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const userId: string = req.user.sub;
    const user: User = await this.userService.getProfile(userId);

    return res.status(200).json({
      status: 'Ok',
      message: 'User profile fetched successfully',
      data: user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('last-activity')
  async getLastActivity(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const userId: string = req.user.sub;
    const session: Session[] = await this.userService.getLastActivity(userId);

    return res.status(200).json({
      status: 'Ok',
      message: 'User session fetched successfully',
      data: session,
    });
  }
}
