/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('sessions')
@Index(['user', 'sessionId'], { unique: true })
export class Session {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  sessionId!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress!: string;

  @Column({ type: 'text', nullable: true })
  userAgent!: string;

  @Column({ type: 'timestamp', nullable: false })
  loginAt!: Date;

  @Column({ type: 'timestamp', nullable: false })
  lastActiveAt!: Date;

  @Column({ type: 'timestamp', nullable: false })  
  expiresAt!: Date

  @ManyToOne(() => User, (user: any) => user.session, { onDelete: 'CASCADE' })
  user!: User;
}