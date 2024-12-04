import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Qrcode } from "../entity/qrcode.entity";

@Injectable()
export class QrcodeRepository {
  constructor(
    @InjectRepository(Qrcode) 
    private readonly qrcodeRepository: Repository<Qrcode>,
  ) {}


  async createQrcode(
    type: 'text' | 'url' | 'email' | 'whatsapp' | 'wifi' | 'social media', 
    payload: string, 
    qrcode: string, 
    createdAt: Date
  ): Promise<Qrcode> {
    return await this.qrcodeRepository.save({ type, payload, qrcode, createdAt });    
  }

}