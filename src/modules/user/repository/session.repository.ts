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

  async createSession(user: any, sessionId: string, ipAddress: string | undefined, userAgent: string | undefined, loginAt: Date, lastActiveAt: Date, expiresAt: Date): Promise<Session> {
    return this.sessionRepository.save({ user, sessionId, ipAddress, userAgent, loginAt, lastActiveAt, expiresAt });
  }

  async updateSession(sessionId: string, lastActiveAt: Date): Promise<any> {
    return this.sessionRepository.update({ sessionId }, { lastActiveAt });
  }

  async endSession(sessionId: string, expiresAt: Date): Promise<any> {
    return this.sessionRepository.update({ sessionId }, { expiresAt });
  }

  async endAllSessions(userId: string): Promise<any> {
    return this.sessionRepository.update({ user: { id: userId } }, { expiresAt: new Date() });
  }

  async findById(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({ 
      where: { user: { id: userId } }, 
      select: ['ipAddress', 'userAgent', 'loginAt', 'lastActiveAt', 'expiresAt'] 
    });
  }

  async findBySessionId(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .select(['session.ipAddress', 'session.userAgent', 'session.expiresAt', 'user.id'])
      .where('session.sessionId = :sessionId', { sessionId })
      .getOne();
  }
}