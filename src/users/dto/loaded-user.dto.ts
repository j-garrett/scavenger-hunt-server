import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class LoadedUserDto {
  @IsNumber()
  id: number;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
