import { Type } from 'class-transformer'
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { Hunt } from 'src/hunts/entities/hunt.entity'
import { UserRoles } from 'src/users/entities/user.entity'

export class LoadedUserDto {
  @Type(() => Hunt)
  hunts: Hunt[]
  @IsNumber()
  id: number
  @IsEnum(UserRoles)
  role: UserRoles
  @ValidateNested({ each: true })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @IsEmail()
  email: string
}
