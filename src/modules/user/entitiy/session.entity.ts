/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user: any) => user.session, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ length: 45, nullable: true })
  ipAddress!: string;

  @Column({ nullable: true })
  userAgent!: string;

  @Column({ type: 'timestamp' })
  lastActiveAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date; 

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}