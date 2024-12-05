import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Hunt } from '../../hunts/entities/hunt.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  username: string

  @Column({ nullable: false })
  password: string

  @OneToMany(() => Hunt, (hunt) => hunt.user)
  hunts: Hunt[]
}
