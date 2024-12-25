/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Url } from "../entity/url.entity";

@Injectable()
export class UrlRepository {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>
  ) {}

  async createUrl(user: any, urlOrigin: string, urlId: string, urlShort: string, createdAt: Date, expiresAt: Date): Promise<Url> {
    return await this.urlRepository.save({ user, urlOrigin, urlId, urlShort, createdAt, expiresAt });
  }

  async findUrl(urlId: string): Promise<Url | null> {
    return await this.urlRepository.findOne({ 
      where: { urlId }, 
      select: ['urlOrigin', 'expiresAt'] 
    });
  }

  async findUrlByUser(userId: string, page: number, limit: number): Promise<{ url: Url[], count: number }> {
    const [url, count] = await this.urlRepository.findAndCount({ 
      where: { user: { id: userId } },
      take: limit, 
      skip: (page - 1) * limit ,
      order: { createdAt: 'DESC' }
    });

    return { url, count };
  }
}