/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('qrcodes')
export class Qrcode {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ['text', 'url', 'email', 'whatsapp', 'wifi', 'social media'], nullable: false })
  type!: string;

  @Column({ type: 'text', nullable: false })
  payload!: string;

  @Column({ type: 'text', nullable: false })
  qrcode!: string;

  @Column({ type: 'timestamp', nullable: false })
  createdAt!: Date;

  @ManyToOne(() => User, (user: any) => user.qrcode, { onDelete: 'CASCADE' })
  user?: User;
}