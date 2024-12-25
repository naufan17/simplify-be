/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('urls')
export class Url {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  urlOrigin!: string;

  @Column({ type: 'text' })
  urlId!: string;

  @Column({ type: 'text' })
  urlShort!: string;

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @ManyToOne(() => User, (user: any) => user.url, { onDelete: 'CASCADE' })
  user?: User;
}