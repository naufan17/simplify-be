import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UrlRepository } from './repository/url.repository';
import { Url } from './entity/url.entity';

@Injectable()
export class ShortenUrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  async shortenUrl(
    userId: string | null,
    urlOrigin: string,
    url: string, 
    alias?: string
  ): Promise<{ 
    urlShort: string; 
    expirationTimestamp: number 
  }> {
    const expiresAt: Date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expirationTimestamp: number = expiresAt.getTime();
    const urlId: string = alias || randomBytes(4).toString('base64url');
    const urlShort: string = `${url}/${urlId}`;

    if (alias) {
      const urlData: Url | null = await this.urlRepository.findUrl(alias);
      if (urlData) throw new ConflictException('Alias already exists');
    }

    const urlStore: Url =  await this.urlRepository.createUrl(userId, urlOrigin, urlId, urlShort, new Date(), expiresAt);
    if (!urlStore) throw new InternalServerErrorException();

    return { urlShort, expirationTimestamp };
  }

  async getOriginUrl(urlId: string): Promise<string>{
    const urlData: Url | null = await this.urlRepository.findUrl(urlId);
    if (!urlData) throw new NotFoundException('URL not found');
    if (urlData.expiresAt < new Date()) throw new NotFoundException('URL expired');

    return urlData.urlOrigin;
  }

  async getShortenUrlByUser(
    userId: string, 
    page: number, 
    limit: number,
  ): Promise<{ 
    url: Url[], 
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

    const { url, count }: { url: Url[], count: number } = await this.urlRepository.findUrlByUser(userId, page, limit);
    if (url.length === 0) throw new NotFoundException('URL history not found');

    const currentPage = page;
    const totalPages = Math.ceil(count / limit);
    const itemsPerPage = limit;
    const totalItems = count;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return { 
      url, 
      meta: { 
        currentPage, 
        totalPages, 
        itemsPerPage, 
        totalItems, 
        hasPreviousPage, 
        hasNextPage 
      }
    };
  }
}
