/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('sessions')
@Index(['user', 'sessionId'], { unique: true })
export class Session {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  sessionId!: string;

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

  @ManyToOne(() => User, (user: any) => user.session, { onDelete: 'CASCADE' })
  user!: User;
}