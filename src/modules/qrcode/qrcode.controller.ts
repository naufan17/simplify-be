import { Controller, Post, HttpStatus, Req, Res, Body } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { Request, Response } from 'express';
import { TextDto } from './dto/text.dto';
import { UrlDto } from './dto/url.dto';
import { EmailDto } from './dto/email.dto';
import { WhatsappDto } from './dto/whatsapp.dto';
import { SocialMediaDto } from './dto/socialMedia.dto';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post('text')
  async textQrcode(@Body() textDto: TextDto, @Req() req: Request, @Res() res: Response) {
    const { text, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: TextDto = textDto;
    const qrcode = await this.qrcodeService.textQrcode(text, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code text generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @Post('url')
  async urlQrcode(@Body() urlDto: UrlDto, @Req() req: Request, @Res() res: Response) {
    const { url, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: UrlDto = urlDto;
    const qrcode = await this.qrcodeService.urlQrcode(url, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code url generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @Post('email')
  async emailQrcode(@Body() emailDto: EmailDto, @Req() req: Request, @Res() res: Response) {
    const { email, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: EmailDto = emailDto;
    const qrcode = await this.qrcodeService.emailQrcode(email, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code email generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @Post('whatsapp')
  async whatsappQrcode(@Body() whatsappDto: WhatsappDto, @Req() req: Request, @Res() res: Response) {
    const { whatsapp, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: WhatsappDto = whatsappDto;
    const qrcode = await this.qrcodeService.whatsappQrcode(whatsapp, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code whatsapp generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }

  @Post('social-media')
  async socialMediaQrcode(@Body() socialMediaDto: SocialMediaDto, @Req() req: Request, @Res() res: Response) {
    const { socialMedia, username, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType }: SocialMediaDto = socialMediaDto;  
    const qrcode = await this.qrcodeService.socialMediaQrcode(socialMedia, username, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);

    return res.status(HttpStatus.CREATED).json({
      message: 'Qr code social media generated successfully',
      success: 'Created',
      statusCode: HttpStatus.CREATED,
      data: { qrcode },
    });
  }
}
