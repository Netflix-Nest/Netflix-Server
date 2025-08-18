import slugify from 'slugify';
import { Actor } from '../../actor/entities/actor.entity';
import { Genre } from '../../genre/entities/genre.entity';
import { Series } from '../../series/entities/series.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Video } from '../../video/entities/video.entity';
import {
  BeforeInsert,
  BeforeUpdate,
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

  @Column({ unique: true })
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title) {
      const baseSlug = slugify(this.title, { lower: true, strict: true });
      this.slug = `${baseSlug}-${Date.now()}`;
    }
  }

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

  @Column({ type: 'int', nullable: true, array: true })
  followers: number[];

  @Column({ nullable: true })
  publishAt: Date;

  @Column()
  quality: string;

  @Column({ type: 'float', default: 0 })
  totalScoreRating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ default: 0 })
  likeCount: number;

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
