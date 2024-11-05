/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Session } from "./session.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  @Column({ type:'text' })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true})
  phoneNumber!: string;

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