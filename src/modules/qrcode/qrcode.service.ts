/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType } from 'qr-code-styling';
import { JSDOM } from 'jsdom';
import nodeCanvas from 'canvas';

@Injectable()
export class QrcodeService {
  async textQrcode(text: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    const qrcode: any = await this.generateQrcode(text, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);
    if (!qrcode) throw new InternalServerErrorException();

    return qrcode;
  }

  async urlQrcode(url: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    const qrcode: any = await this.generateQrcode(url, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);
    if (!qrcode) throw new InternalServerErrorException();

    return qrcode;
  }

  async emailQrcode(email: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    const formattedEmail = `mailto:${email}`;
    const qrcode: any = await this.generateQrcode(formattedEmail, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);
    if (!qrcode) throw new InternalServerErrorException();

    return qrcode;
  }

  async whatsappQrcode(whatsapp: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    const formattedWhatsapp = 'https://wa.me/62' + whatsapp.substring(1);
    const qrcode: any = await this.generateQrcode(formattedWhatsapp, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);
    if (!qrcode) throw new InternalServerErrorException();

    return qrcode;
  }

  async socialMediaQrcode(socialMedia: string, username: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    let url: string;
    switch (socialMedia) {
      case 'instagram':
        url = `https://www.${socialMedia}.com/${username}`
        break;
      case 'facebook':
        url = `https://www.${socialMedia}.com/${username}`
        break;
      case 'twitter':
        url = `https://www.${socialMedia}.com/${username}`
        break;
      case 'linkedin':
        url = `https://www.${socialMedia}.com/in/${username}`
        break;
      default:
        throw new NotFoundException('Invalid social media');
    }

    const qrcode: any = await this.generateQrcode(url, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);
    if (!qrcode) throw new InternalServerErrorException();

    return qrcode;
  }

  async generateQrcode(payload: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    const qrcode: QRCodeStyling = new QRCodeStyling({
      jsdom: JSDOM,
      nodeCanvas,
      data: payload,
      width: size || 300,
      height: size || 300,
      margin: margin || 6,
      qrOptions: {
        errorCorrectionLevel: 'H'
      },
      dotsOptions: {
        color: dotsColor || '#000000',
        type: dotsType || 'square'
      },
      backgroundOptions: {
        color: backgroundColor || '#ffffff',
      },
      cornersSquareOptions: {
        color: cornersSquareColor || '#000000',
        type: cornersSquareType || 'square'
      },
      cornersDotOptions: {
        color: cornersDotColor || '#000000',
        type: cornersDotType || 'square'
      },
    })

    const qrcodeUrl: any = await qrcode.getRawData("png");
    
    return qrcodeUrl.toString('base64')
  }
}
