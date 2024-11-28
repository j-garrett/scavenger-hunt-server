import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm'

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
}
