import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { SessionRepository } from './repository/session.repository';
import { User } from './entitiy/user.entity';
import { Session } from './entitiy/session.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async getProfile(userId: string) {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
      
    return user;
  }

  async getLastActivity(userId: string) {
    const session: Session[] | null = await this.sessionRepository.findById(userId);
    if (!session) throw new NotFoundException('User session not found');
      
    return session;
  }
}
