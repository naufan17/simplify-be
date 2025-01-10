/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('urls')
@Index(['urlId'])
export class Url {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  urlOrigin!: string;

  @Column({ type: 'text', nullable: true })
  urlId!: string;

  @Column({ type: 'text', nullable: false })
  urlShort!: string;

  @Column({ type: 'timestamp', nullable: false })
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt!: Date;

  @ManyToOne(() => User, (user: any) => user.url, { onDelete: 'CASCADE' })
  user?: User;
}