import { Content } from 'src/content/entities/content.entity';
import { Video } from 'src/video/entities/video.entity';
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

  @Column()
  totalEpisodes: number;

  @Column()
  seasonNumber: number;

  @Column({ default: 1 })
  totalSeasonNumber: number; // All season published

  @OneToOne(() => Content, (content) => content.series)
  @JoinColumn()
  content: Content;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
