import { PartialType } from '@nestjs/swagger'
import { CreateHuntDto } from './create-hunt.dto'

export class UpdateHuntDto extends PartialType(CreateHuntDto) {}
