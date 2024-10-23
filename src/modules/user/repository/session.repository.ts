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

  async createSession(user: any, refreshToken: string, ipAddress: string | undefined, userAgent: string | undefined, loginAt: Date, lastActiveAt: Date, expireAt: Date): Promise<Session> {
    return await this.sessionRepository.save({ user, refreshToken, ipAddress, userAgent, loginAt, lastActiveAt, expireAt });
  }

  async updateSession(refreshToken: string, lastActiveAt: Date): Promise<any> {
    return await this.sessionRepository.update({ refreshToken }, { lastActiveAt });
  }

  async endSession(refreshToken: string, expireAt: Date): Promise<any> {
    return await this.sessionRepository.update({ refreshToken }, { expireAt });
  }

  async findById(userId: string): Promise<Session[]> {
    return await this.sessionRepository.find({ where: { user: { id: userId } }, select: ['ipAddress', 'userAgent', 'loginAt', 'lastActiveAt', 'expireAt'] });
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return await this.sessionRepository.findOne({ where: { refreshToken }, select: ['expireAt'] });
  }
}