/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(() => User, (user: any) => user.qrcode, { onDelete: 'CASCADE' })
  user?: User;
}