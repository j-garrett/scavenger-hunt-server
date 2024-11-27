import { IsString, IsBoolean } from 'class-validator';

export class AnswerDto {
  @IsString()
  value: string;

  @IsString()
  type: 'text' | 'image';

  @IsBoolean()
  exact: boolean;
}
