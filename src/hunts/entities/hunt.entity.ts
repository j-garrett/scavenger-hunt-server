import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { UserEntity } from '../../users/entities/user.entity'
import { HuntStep } from './hunt-step.entity'

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
