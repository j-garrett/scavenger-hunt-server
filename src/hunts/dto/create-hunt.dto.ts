import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { HuntStepDto } from './hunt-step.dto'

export class CreateHuntDto {
  @IsNumber()
  @IsOptional()
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

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value ?? true)
  isPublic: boolean = true
}
