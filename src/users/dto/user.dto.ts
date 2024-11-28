import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'
export class UserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  username: string

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  password: string
}
