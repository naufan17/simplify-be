import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Url } from "../entitiy/url.entitiy";

@Injectable()
export class UrlRepository {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>
  ) {}

  async createUrl(url: string, urlId: string, createdAt: Date, expiresAt: Date): Promise<Url> {
    return await this.urlRepository.save({ url, urlId, createdAt, expiresAt });
  }

  async findUrl(urlId: string): Promise<Url | null> {
    return await this.urlRepository.findOne({ where: { urlId }, select: ['url', 'expiresAt'] });
  }
}