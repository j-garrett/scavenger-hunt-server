import { IsString, IsInt, ValidateNested } from 'class-validator';

class Answer {
  @IsString()
  value: string;
  @IsString()
  type: 'text' | 'image';
  @IsString()
  exact: boolean;
}

export class CreateHuntDto {
  @ValidateNested()
  answer: Answer;
  @IsString()
  clue: string;
  @IsString()
  description?: string;
  @IsInt()
  latitude: number;
  @IsInt()
  longitude: number;
  @IsString()
  name: string;
}
