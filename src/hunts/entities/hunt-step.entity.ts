import {
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Entity,
  JoinColumn,
} from 'typeorm';
import { Hunt } from './hunt.entity';
import { HuntStepAnswer } from 'src/hunts/entities/hunt-step-answer.entity';

@Entity()
export class HuntStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  clue: string;

  @Column({ nullable: true })
  description?: string;

  @Column('double precision', { nullable: false })
  latitude: number;

  @Column('double precision', { nullable: false })
  longitude: number;

  @ManyToOne(() => Hunt, (hunt) => hunt.steps, {
    nullable: false,
  })
  hunt: Hunt;

  @OneToOne(() => HuntStepAnswer, (huntStepAnswer) => huntStepAnswer, {
    nullable: false,
  })
  @JoinColumn()
  answer: HuntStepAnswer;
}
