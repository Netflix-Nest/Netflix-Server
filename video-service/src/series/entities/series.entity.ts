import { Content } from '../../content/entities/content.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  totalEpisodes: number;

  @Column()
  seasonNumber: number;

  @Column({ default: 1 })
  totalSeasonNumber: number; // All season published

  @OneToOne(() => Content, (content) => content.series)
  contents: Content;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
