import { Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { HuntStepDto } from './hunt-step.dto'

export class CreateHuntDto {
  @IsNumber()
  userId: number

  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HuntStepDto)
  steps: HuntStepDto[]
}
