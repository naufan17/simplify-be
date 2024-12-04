import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('qrcodes')
export class Qrcode {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: ['text', 'url', 'email', 'whatsapp', 'wifi', 'social media'] })
  type!: string;

  @Column({ type: 'text' })
  payload!: string;

  @Column({ type: 'text' })
  qrcode!: string;

  @Column({ type: 'timestamp' })
  createdAt!: Date;
}