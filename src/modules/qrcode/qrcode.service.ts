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

  async wifiQrcode(ssid: string, password: string | undefined, encryption: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    const formattedWifi = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
    const qrcode: any = await this.generateQrcode(formattedWifi, size, margin, dotsColor, dotsType, backgroundColor, cornersSquareColor, cornersSquareType, cornersDotColor, cornersDotType);
    if (!qrcode) throw new InternalServerErrorException();

    return qrcode;
  }

  async socialMediaQrcode(socialMedia: string, username: string, size: number | undefined, margin: number | undefined, dotsColor: string | undefined, dotsType: DotType | undefined, backgroundColor: string | undefined, cornersSquareColor: string | undefined, cornersSquareType: CornerSquareType | undefined, cornersDotColor: string | undefined, cornersDotType: CornerDotType | undefined) {
    let url: string;
    // let image: string;
    switch (socialMedia) {
      case 'instagram':
        url = `https://www.${socialMedia}.com/${username}`
        // image = 'https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg'
        dotsColor = '#ffffff'
        backgroundColor = '#d62976'
        cornersSquareColor = '#ffffff'
        cornersDotColor = '#ffffff'
        break;
      case 'facebook':
        url = `https://www.${socialMedia}.com/${username}`
        // image = 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg'
        dotsColor = '#ffffff'
        backgroundColor = '#1877F2'
        cornersSquareColor = '#ffffff'
        cornersDotColor = '#ffffff'
        break;
      case 'x':
        url = `https://www.${socialMedia}.com/${username}`
        // image = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/X_logo.jpg'
        dotsColor = '#ffffff'
        backgroundColor = '#000000'
        cornersSquareColor = '#ffffff'
        cornersDotColor = '#ffffff'
        break;
      case 'linkedin':
        url = `https://www.${socialMedia}.com/in/${username}`
        // image = 'https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg'
        dotsColor = '#ffffff'
        backgroundColor = '#0077B5'
        cornersSquareColor = '#ffffff'
        cornersDotColor = '#ffffff'
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
      // image: image || '',
      width: size || 300,
      height: size || 300,
      margin: margin || 6,
      qrOptions: {
        errorCorrectionLevel: 'H'
      },
      // imageOptions: {
      //   imageSize: 0.25,
      //   crossOrigin: 'anonymous',
      // },
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
