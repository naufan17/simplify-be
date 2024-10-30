import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { Request, Response } from 'express';
import { ShortenUrlService } from './shorten-url.service';
import { ShortenUrlDto } from './dto/shortenUrl.dto';
import { RedirectUrlDto } from './dto/redirectUrl.dto';

@Controller()
export class ShortenUrlController {
  constructor(private readonly shortenUrlService: ShortenUrlService) {}

  @Post('/shorten-url')
  async shortenUrl(@Body() shortenUrlDto: ShortenUrlDto, @Req() req: Request, @Res() res: Response) {
    const { url }: ShortenUrlDto = shortenUrlDto;
    const shortId: string = await this.shortenUrlService.shortenUrl(url);
    const shortenUrl: string = `${req.protocol}://${req.get('host')}/${shortId}`;

    return res.status(HttpStatus.CREATED).json({
      message: 'Shorten url created successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { url: shortenUrl },
    });
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:urlId')
  async redirectToOriginalUrl(@Param() redirectUrlDto: RedirectUrlDto , @Req() req: Request, @Res() res: Response) {
    const { urlId }: RedirectUrlDto = redirectUrlDto;
    const originalUrl: string = await this.shortenUrlService.getOriginalUrl(urlId);
    
    return res.status(HttpStatus.MOVED_PERMANENTLY).redirect(originalUrl);
  }
}
