import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index(['userId'])
@Index(['userId', 'contentIds'])
@Entity('watchlists')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('int', { array: true, default: [], name: 'content_ids' })
  contentIds: number[];

  @Column()
  name: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
