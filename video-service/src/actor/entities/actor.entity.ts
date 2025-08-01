import { Content } from 'src/content/entities/content.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index(['fullName'])
@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  nationality?: string;

  @Column({ nullable: true, type: 'text' })
  biography?: string;

  @ManyToMany(() => Content, (content) => content.actors, { nullable: true })
  @JoinTable()
  contents: Content[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
