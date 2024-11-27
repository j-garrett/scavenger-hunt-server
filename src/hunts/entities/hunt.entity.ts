import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { HuntStep } from './hunt-step.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Hunt {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => HuntStep, (huntStep) => huntStep.hunt, { cascade: true })
  steps: HuntStep[];

  @Column({ nullable: true })
  description?: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.hunts, { nullable: false })
  user: User;
}
