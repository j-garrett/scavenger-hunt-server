import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { Hunt } from 'src/hunts/entities/hunt.entity'

import { CreateHuntDto } from './dto/create-hunt.dto'
import { UpdateHuntDto } from './dto/update-hunt.dto'
import { HuntsService } from './hunts.service'

@Controller('hunts')
export class HuntsController {
  constructor(private readonly huntsService: HuntsService) {}

  @Post()
  async create(@Body() createHuntDto: CreateHuntDto) {
    return this.huntsService.create(createHuntDto)
  }

  @Get()
  async findAll(): Promise<Hunt[]> {
    return this.huntsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.huntsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHuntDto: UpdateHuntDto) {
    return this.huntsService.update(+id, updateHuntDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.huntsService.remove(id)
  }
}
