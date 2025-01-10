/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Session } from "./session.entity";
import { Url } from "src/modules/shorten-url/entity/url.entity";
import { Qrcode } from "src/modules/qrcode/entity/qrcode.entity";

@Entity('users')
@Index(['email', 'phoneNumber'], { unique: true })
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  @Column({ type:'text', nullable: false })
  name!: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'text', unique: true, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'text', nullable: false })
  profileImage?: string;

  @Column({ type: 'boolean', enum:[false, true], default: false })
  isVerified!: boolean

  @Column({ type: 'text', nullable: false })
  password!: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Session, (session: any) => session.user)
  session?: Session[]

  @OneToMany(() => Url, (url: any) => url.user)
  url?: Url[]

  @OneToMany(() => Qrcode, (qrcode: any) => qrcode.user)
  qrcode?: Qrcode[]
}