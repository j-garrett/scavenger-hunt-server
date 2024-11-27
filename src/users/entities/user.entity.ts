import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Hunt } from '../../hunts/entities/hunt.entity';

export enum UserRole {
  USER = 'user',
  SUPERUSER = 'superuser',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Hunt, (hunt) => hunt.user)
  hunts: Hunt[];
}
