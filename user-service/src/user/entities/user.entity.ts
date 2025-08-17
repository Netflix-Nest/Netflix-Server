import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum StatusUser {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BANNED = 'BANNED',
}
@Index(['email'])
@Index(['username'])
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  password: string;

  @Column({ type: 'int', default: 0, name: 'viewing_time' })
  viewingTime: number; // minutes, record forever

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'PENDING' })
  status: StatusUser;

  @Column('int', { nullable: true, array: true })
  favoriteGenre: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
