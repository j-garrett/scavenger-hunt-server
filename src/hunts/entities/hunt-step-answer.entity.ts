import { HuntStep } from 'src/hunts/entities/hunt-step.entity'
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class HuntStepAnswer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  exact: boolean

  @Column()
  type: 'text' | 'image'

  @Column()
  value: string

  @OneToOne(() => HuntStep, (huntStep) => huntStep.answer)
  huntStep: HuntStep
}
