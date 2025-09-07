import { Content } from '../../content/entities/content.entity';
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

  @ManyToOne(() => Content, { nullable: true })
  @JoinColumn()
  contents: Content;

  @Column({ type: 'int' })
  uploader: number;

  @Column()
  status: string;

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
