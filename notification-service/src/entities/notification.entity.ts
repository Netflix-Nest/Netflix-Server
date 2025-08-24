import { Channels, Status, StatusInApp } from '@netflix-clone/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  type?: string; // RECOMMENDATION, BILLING, SYSTEM...

  @Column({ nullable: true })
  channels?: Channels;

  @Column({ nullable: true })
  status?: Status | StatusInApp;

  @Column({ nullable: true, type: 'jsonb' })
  metadata?: {
    movieId?: string;
    link?: string;
  };

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  readAt: Date;
}
