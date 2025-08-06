import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index(['userId'])
@Entity('histories')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  contentId: number;

  @Column()
  watchedAt: Date;

  @Column()
  duration: number;

  @Column({ nullable: true })
  deviceInfo: string;
}
