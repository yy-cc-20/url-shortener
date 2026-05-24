import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column()
  originalUrl!: string;

  @Index({ unique: true })
  @Column({ length: 10 })
  shortUrl!: string;

  @Column({ default: 0 })
  clickCount!: number;

  @Column({ type: 'timestamp', nullable: true })
  expiryTime?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
