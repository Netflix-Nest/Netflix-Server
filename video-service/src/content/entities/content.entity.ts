import { Actor } from 'src/actor/entities/actor.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { Series } from 'src/series/entities/series.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Video } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index(['title'])
@Index(['type'])
@Index(['year'])
@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @ManyToMany(() => Genre, (genre) => genre.contents)
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Tag, (tag) => tag.contents)
  @JoinTable()
  tags: Tag[];

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  director?: string;

  @Column({ default: 'single' })
  type: 'single' | 'series';

  @OneToOne(() => Video, (video) => video.contents, { nullable: true })
  video?: Video;

  @OneToOne(() => Series, (series) => series.contents, { nullable: true })
  @JoinColumn()
  series?: Series;

  @ManyToMany(() => Actor, (actor) => actor.contents)
  @JoinTable()
  actors?: Actor[];

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'bigint' })
  view: number;

  @Column({ type: 'bigint' })
  followers: number;

  @Column()
  quality: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column()
  studio: string;

  @Column()
  season: string; // spring / summer / autumn / winter

  @OneToOne(() => Video)
  @JoinColumn()
  trailer: Video;

  @Column()
  ageRating: number; // 16+, 17+,...

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
