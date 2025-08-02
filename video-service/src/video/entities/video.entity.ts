import { Content } from 'src/content/entities/content.entity';
import { Series } from 'src/series/entities/series.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

export enum VideoStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  episodeNumber?: number;

  @Column({ nullable: true })
  seasonNumber?: number;

  @OneToOne(() => Content, { nullable: true })
  @JoinColumn()
  contents: Content;

  @Column({ type: 'bigint' })
  uploader: number;

  @Column({
    type: 'enum',
    enum: VideoStatus,
    default: VideoStatus.PENDING,
  })
  status: VideoStatus;

  @Column({ nullable: true })
  originalUrl?: string;

  @Column({ nullable: true })
  hlsUrl?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ type: 'float', nullable: true })
  duration?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
