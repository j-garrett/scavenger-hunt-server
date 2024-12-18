import { HuntStepAnswer } from 'src/hunts/entities/hunt-step-answer.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Hunt } from './hunt.entity'

@Entity()
export class HuntStep {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  clue: string

  @Column()
  description: string

  @Column('double precision', { nullable: false })
  latitude: number

  @Column('double precision', { nullable: false })
  longitude: number

  @ManyToOne(() => Hunt, (hunt) => hunt.steps, {
    nullable: false,
  })
  hunt: Hunt

  @OneToOne(() => HuntStepAnswer, (huntStepAnswer) => huntStepAnswer.huntStep, {
    nullable: false,
  })
  answer: HuntStepAnswer
}
