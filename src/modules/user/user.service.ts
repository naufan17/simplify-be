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

  async getSession(
    userId: string, 
    page: number, 
    limit: number
  ): Promise<{ 
    sessions: { 
      ipAddress: string; 
      userAgent: string; 
      loginAt: Date; 
      lastActiveAt: Date; 
      status: string 
    }[], 
    meta: { 
      currentPage: number; 
      totalPages: number; 
      itemsPerPage: number; 
      totalItems: number; 
      hasPreviousPage: boolean; 
      hasNextPage: boolean 
    }
  }> {
    if (isNaN(page)) page = 1;
    if (isNaN(limit)) limit = 10;

    const { session, count }: { session: Session[], count: number } = await this.sessionRepository.findByUserId(userId, page, limit);
    if (session.length === 0) throw new NotFoundException('User session not found');
      
    const sessions: { ipAddress: string; userAgent: string; loginAt: Date; lastActiveAt: Date; status: string }[] = session.map(sessions => {
      const isActive = new Date() < new Date(sessions.expiresAt);
      const { id, expiresAt, ...sessionsData } = sessions;
      return { ...sessionsData, status: isActive ? 'active' : 'expired' };
    });

    const currentPage = page;
    const totalPages = Math.ceil(count / limit);
    const itemsPerPage = limit;
    const totalItems = count;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return { sessions, meta: { currentPage, totalPages, itemsPerPage, totalItems, hasPreviousPage, hasNextPage }};
  }
}
