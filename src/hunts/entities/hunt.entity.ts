import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from '../../users/entities/user.entity'
import { HuntStep } from './hunt-step.entity'

@Entity()
export class Hunt {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => HuntStep, (huntStep) => huntStep.hunt)
  steps: HuntStep[]

  @Column()
  description: string

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.hunts, { nullable: false })
  user: User
}
