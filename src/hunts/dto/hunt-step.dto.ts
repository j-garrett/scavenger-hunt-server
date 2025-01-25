import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

import { AnswerDto } from './answer.dto'

export class HuntStepDto {
  @IsString()
  clue: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  latitude: number

  @IsNumber()
  longitude: number

  @ValidateNested()
  @Type(() => AnswerDto)
  answer: AnswerDto
}
