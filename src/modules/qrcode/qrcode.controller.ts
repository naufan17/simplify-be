import { Controller, Post, HttpStatus, Res, Body, UseGuards, Get, Query } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { Response } from 'express';
import { TextDto } from './dto/text.dto';
import { UrlDto } from './dto/url.dto';
import { EmailDto } from './dto/email.dto';
import { WhatsappDto } from './dto/whatsapp.dto';
import { SocialMediaDto } from './dto/socialMedia.dto';
import { WifiDto } from './dto/wifi.dto'
import { OptionalAccessJwtAuthGuard } from 'src/common/guard/auth/optional-access-jwt-auth.guard';
import { UserId } from 'src/common/decorators/user.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/auth/access-jwt-auth.guard';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Post('text')
  async textQrcode(
    @UserId() userId: string,    
    @Body() textDto: TextDto, 
    @Res() res: Response
  ) {
    const { text, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: TextDto = textDto;
    const qrcode: string = await this.qrcodeService.textQrcode(userId, text, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code text generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Post('url')
  async urlQrcode(
    @UserId() userId: string,
    @Body() urlDto: UrlDto, 
    @Res() res: Response
  ) {
    const { url, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: UrlDto = urlDto;
    const qrcode: string = await this.qrcodeService.urlQrcode(userId, url, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code url generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Post('email')
  async emailQrcode(
    @UserId() userId: string,
    @Body() emailDto: EmailDto, 
    @Res() res: Response
  ) {
    const { email, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: EmailDto = emailDto;
    const qrcode: string = await this.qrcodeService.emailQrcode(userId, email, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code email generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Post('whatsapp')
  async whatsappQrcode(
    @UserId() userId: string,
    @Body() whatsappDto: WhatsappDto, 
    @Res() res: Response
  ) {
    const { whatsapp, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: WhatsappDto = whatsappDto;
    const qrcode: string = await this.qrcodeService.whatsappQrcode(userId,whatsapp, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code whatsapp generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Post('wifi')
  async wifiQrcode(
    @UserId() userId: string,
    @Body() wifiDto: WifiDto, 
    @Res() res: Response
  ) {
    const { ssid, password, encryption, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: WifiDto = wifiDto;
    const qrcode: string = await this.qrcodeService.wifiQrcode(userId, ssid, password, encryption, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code wifi generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Post('social-media')
  async socialMediaQrcode(
    @UserId() userId: string,
    @Body() socialMediaDto: SocialMediaDto, 
    @Res() res: Response
  ) {
    const { socialMedia, username, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: SocialMediaDto = socialMediaDto;  
    const qrcode: string = await this.qrcodeService.socialMediaQrcode(userId,socialMedia, username, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code social media generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('history')
  async getQrcodeByUser(
    @UserId() userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response
  ) {
    const { qrcode, meta } = await this.qrcodeService.getQrcodeByUser(userId, page, limit);

    return res.status(HttpStatus.OK).json({
      message: 'Qr code fetched successfully',
      success: 'Ok',
      statusCode: HttpStatus.OK,
      data: { qrcode, meta },
    });
  }
}
