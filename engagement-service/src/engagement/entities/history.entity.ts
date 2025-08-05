import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
