/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "../entitiy/session.entity";
import { Repository } from "typeorm";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) {}

  async createSession(user: any, refreshToken: string, ipAddress: string | undefined, userAgent: string | undefined, loginAt: Date, lastActiveAt: Date, expiresAt: Date): Promise<Session> {
    return await this.sessionRepository.save({ user, refreshToken, ipAddress, userAgent, loginAt, lastActiveAt, expiresAt });
  }

  async updateSession(refreshToken: string, lastActiveAt: Date): Promise<any> {
    return await this.sessionRepository.update({ refreshToken }, { lastActiveAt });
  }

  async endSession(refreshToken: string, expiresAt: Date): Promise<any> {
    return await this.sessionRepository.update({ refreshToken }, { expiresAt });
  }

  async endAllSessions(userId: string): Promise<any> {
    return await this.sessionRepository.update({ user: { id: userId } }, { expiresAt: new Date() });
  }

  async findById(userId: string): Promise<Session[]> {
    return await this.sessionRepository.find({ 
      where: { user: { id: userId } }, 
      select: ['ipAddress', 'userAgent', 'loginAt', 'lastActiveAt', 'expiresAt'] 
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return await this.sessionRepository.findOne({ 
      where: { refreshToken }, 
      select: ['ipAddress', 'userAgent','expiresAt'] 
    });
  }
}