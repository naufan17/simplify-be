/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { SessionRepository } from './repository/session.repository';
import { User } from './entity/user.entity';
import { Session } from './entity/session.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
      
    return user;
  }

  async getSession(userId: string): Promise<{ ipAddress: string; userAgent: string; loginAt: Date; lastActiveAt: Date; status: string }[]> {
    const sessions: Session[] = await this.sessionRepository.findById(userId);
    if (sessions.length === 0) throw new NotFoundException('User session not found');
      
    return sessions.map(session => {
      const isActive = new Date() < new Date(session.expiresAt);
      const { expiresAt, ...sessionsData } = session;
      return { ...sessionsData, status: isActive ? 'active' : 'expired' };
    });
  }
}
