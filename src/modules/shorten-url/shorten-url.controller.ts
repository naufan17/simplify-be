import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { Request, Response } from 'express';
import { OptionalAccessJwtAuthGuard } from 'src/common/guard/auth/optional-access-jwt-auth.guard';
import { ShortenUrlService } from './shorten-url.service';
import { ShortenUrlDto } from './dto/shortenUrl.dto';
import { RedirectUrlDto } from './dto/redirectUrl.dto';
import { UserId } from 'src/common/decorators/user.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/auth/access-jwt-auth.guard';

@Controller()
export class ShortenUrlController {
  constructor(private readonly shortenUrlService: ShortenUrlService) {}

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Post('/shorten-url')
  async shortenUrl(
    @UserId() userId: string,
    @Body() shortenUrlDto: ShortenUrlDto, 
    @Req() req: Request, 
    @Res() res: Response
  ) {
    const { urlOrigin, alias }: ShortenUrlDto = shortenUrlDto;
    const url: string = `${req.protocol}://${req.get('host')}`;
    const { 
      urlShort, 
      expirationTimestamp 
    }: { 
      urlShort: string; 
      expirationTimestamp: number 
    } = await this.shortenUrlService.shortenUrl(userId, urlOrigin, url, alias);

    return res.status(HttpStatus.CREATED).json({
      message: 'Shorten url created successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { 
        url: urlShort,
        expiresAt: expirationTimestamp
      },
    });
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:urlId')
  async redirectToOriginalUrl(
    @Param() redirectUrlDto: RedirectUrlDto, 
    @Res() res: Response
  ) {
    const { urlId }: RedirectUrlDto = redirectUrlDto;
    const urlOrigin: string = await this.shortenUrlService.getOriginUrl(urlId);
    
    return res.status(HttpStatus.MOVED_PERMANENTLY).redirect(urlOrigin);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('/shorten-url/history')
  async getShortenUrlByUser(
    @UserId() userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response
  ) {
    const { url, meta } = await this.shortenUrlService.getShortenUrlByUser(userId, page, limit);

    return res.status(HttpStatus.OK).json({
      message: 'Shorten url fetched successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { url, meta },
    });
  }
}
