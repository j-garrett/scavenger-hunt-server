import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { HuntStep } from './hunt-step.entity'
import { UserEntity } from '../../users/entities/user.entity'

@Entity()
export class Hunt {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => HuntStep, (huntStep) => huntStep.hunt, { cascade: true })
  steps: HuntStep[]

  @Column({ nullable: true })
  description?: string

  @Column()
  name: string

  @ManyToOne(() => UserEntity, (user) => user.hunts, { nullable: false })
  user: UserEntity
}
