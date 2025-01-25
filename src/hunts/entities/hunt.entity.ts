import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { UserEntity } from '../../users/entities/user.entity'
import { HuntStep } from './hunt-step.entity'

@Entity()
export class Hunt {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => HuntStep, (huntStep) => huntStep.hunt, {
    nullable: true,
  })
  steps: HuntStep[]

  @Column({ nullable: true })
  description?: string

  @Column()
  name: string

  @Column({ default: true })
  isPublic: boolean

  @ManyToOne(() => UserEntity, (user) => user.hunts, { nullable: true })
  user: UserEntity
}
