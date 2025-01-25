import { IsString, IsBoolean, IsEnum } from 'class-validator'

export enum AnswerType {
  TEXT = 'text',
  IMAGE = 'image',
}

export class AnswerDto {
  @IsString()
  value: string

  @IsEnum(AnswerType)
  type: AnswerType

  @IsBoolean()
  exact: boolean
}
