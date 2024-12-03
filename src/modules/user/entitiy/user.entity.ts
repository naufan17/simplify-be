/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Session } from "./session.entity";

@Entity('users')
@Index(['email', 'phoneNumber'], { unique: true })
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  @Column({ type:'text' })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, nullable: true })
  phoneNumber?: string;

  @Column({ default: false })
  isVerified!: boolean

  @Column({ type: 'text' })
  password!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Session, (session: any) => session.user)
  session?: Session[]
}