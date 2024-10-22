/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "./entitiy/session.entity";
import { Repository } from "typeorm";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) {}

  async createSession(user: any, ipAddress: string | undefined, userAgent: string | undefined, lastActiveAt: Date): Promise<Session> {
    return await this.sessionRepository.save({ user, ipAddress, userAgent, lastActiveAt });
  }
}