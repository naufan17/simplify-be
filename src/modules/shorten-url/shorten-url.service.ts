import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UrlRepository } from './repository/url.repository';
import { Url } from './entity/url.entity';

@Injectable()
export class ShortenUrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  async shortenUrl(originalUrl: string, alias?: string): Promise<{ urlId: string; expirationTimestamp: number }> {
    const expiresAt: Date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expirationTimestamp: number = expiresAt.getTime();
    const urlId: string = alias || randomBytes(4).toString('base64url');

    if (alias) {
      const urlData: Url | null = await this.urlRepository.findUrl(alias);
      if (urlData) throw new ConflictException('Alias already exists');
    }

    const urlStore: Url =  await this.urlRepository.createUrl(originalUrl, urlId, new Date(), expiresAt);
    if (!urlStore) throw new InternalServerErrorException();

    return { urlId, expirationTimestamp };
  }

  async getOriginalUrl(urlId: string): Promise<string>{
    const urlData: Url | null = await this.urlRepository.findUrl(urlId);
    if (!urlData) throw new NotFoundException('URL not found');
    if (urlData.expiresAt < new Date()) throw new NotFoundException('URL expired');

    return urlData.url;
  }
}
