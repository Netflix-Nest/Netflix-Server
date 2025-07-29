import { Genre } from 'src/genre/entities/genre.entity';
import { Series } from 'src/series/entities/series.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Video } from 'src/video/entities/video.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
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

  @OneToOne(() => Video, (video) => video.content, { nullable: true })
  video?: Video;

  @OneToOne(() => Series, (series) => series.content, { nullable: true })
  series?: Series;

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
  season: string;

  @OneToOne(() => Video)
  @JoinColumn()
  trailer: Video;

  @Column()
  ageRating: number; // 16+, 17+,...
}
