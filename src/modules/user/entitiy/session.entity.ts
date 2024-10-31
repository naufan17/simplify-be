/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user: any) => user.session, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'text' })
  refreshToken!: string;

  @Column({ length: 45, nullable: true })
  ipAddress!: string;

  @Column({ nullable: true })
  userAgent!: string;

  @Column({ type: 'timestamp' })
  loginAt!: Date;

  @Column({ type: 'timestamp' })
  lastActiveAt!: Date;

  @Column({ type: 'timestamp' })  
  expiresAt!: Date
}