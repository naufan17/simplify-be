/* eslint-disable @typescript-eslint/no-explicit-any */
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
    user: any,
    type: 'text' | 'url' | 'email' | 'whatsapp' | 'wifi' | 'social media', 
    payload: string, 
    qrcode: string, 
    createdAt: Date
  ): Promise<Qrcode> {
    return await this.qrcodeRepository.save({ user, type, payload, qrcode, createdAt });    
  }

  async findQrcodeByUser(
    userId: string, 
    page: number, 
    limit: number
  ): Promise<{ 
    qrcode: Qrcode[], 
    count: number 
  }> {
    const [qrcode, count] = await this.qrcodeRepository.findAndCount({
      where: { user: { id: userId } },
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' }
    });

    return { qrcode, count };
  }

  async filterQrcodeByUser(
    userId: string, 
    page: number, 
    limit: number,
    filter: 'text' | 'url' | 'email' | 'whatsapp' | 'wifi' | 'social media'
  ): Promise<{ 
    qrcode: Qrcode[], 
    count: number 
  }> {
    const [qrcode, count] = await this.qrcodeRepository.findAndCount({
      where: { user: { id: userId }, type: filter },
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' }
    });

    return { qrcode, count };
  }
}