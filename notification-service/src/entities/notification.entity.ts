import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export enum Channels {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum Status {
  SENT = 'SENT',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export enum StatusInApp {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

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
