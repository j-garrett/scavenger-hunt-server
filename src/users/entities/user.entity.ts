import { Exclude } from 'class-transformer'
import { Hunt } from 'src/hunts/entities/hunt.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

export enum UserRoles {
  ADMIN = 'admin',
  GUEST = 'guest',
  SUPERUSER = 'superuser',
  USER = 'user',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  // @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: false })
  @Exclude()
  password: string

  @Column({ default: UserRoles.USER, type: 'varchar' })
  role: UserRoles

  @OneToMany(() => Hunt, (hunt) => hunt.user)
  hunts: Hunt[]

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
