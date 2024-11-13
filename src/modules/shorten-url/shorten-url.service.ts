import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UrlRepository } from './repository/url.repository';
import { Url } from './entitiy/url.entitiy';

@Injectable()
export class ShortenUrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  async shortenUrl(originalUrl: string): Promise<{ urlId: string; expiresAtTimestamp: number }> {
    const urlId: string = randomBytes(4).toString('base64url');
    const expiresAt: Date = new Date(Date.now() + 30 * 24 * 60 * 1000);
    const expiresAtTimestamp: number = Math.floor(expiresAt.getTime() / 1000);
    const urlStore: Url =  await this.urlRepository.createUrl(originalUrl, urlId, new Date(), expiresAt);
    if (!urlStore) throw new InternalServerErrorException();

    return { urlId, expiresAtTimestamp };
  }

  async getOriginalUrl(urlId: string): Promise<string>{
    const urlData: Url | null = await this.urlRepository.findUrl(urlId);
    if (!urlData) throw new NotFoundException('URL not found');
    if (urlData.expiresAt < new Date()) throw new NotFoundException('URL expired');

    return urlData.url;
  }
}
