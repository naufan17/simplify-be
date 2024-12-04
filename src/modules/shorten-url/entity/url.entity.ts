import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('urls')
export class Url {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'text' })
  urlId!: string;

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;
}