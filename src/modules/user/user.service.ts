/* eslint-disable @typescript-eslint/no-unused-vars */
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

  async getSession(userId: string) {
    const session: Session[] = await this.sessionRepository.findById(userId);
    if (session.length === 0) throw new NotFoundException('User session not found');
      
    return session.map(sessions => {
      const isActive = new Date() < new Date(sessions.expiresAt);
      const { expiresAt, ...sessionsData } = sessions;
      return { ...sessionsData, status: isActive ? 'active' : 'expired' };
    });
  }
}
