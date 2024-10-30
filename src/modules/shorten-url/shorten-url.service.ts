import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class ShortenUrlService {
  private urlStore: Map<string, string> = new Map<string, string>();

  async shortenUrl(originalUrl: string) {
    const urlId: string = randomBytes(5).toString('hex');
    this.urlStore.set(urlId, originalUrl);
    
    return urlId;
  }

  async getOriginalUrl(urlId: string) {
    const originalUrl: string | undefined = this.urlStore.get(urlId);
    if (!originalUrl) throw new NotFoundException('URL not found');

    return originalUrl;
  }
}
