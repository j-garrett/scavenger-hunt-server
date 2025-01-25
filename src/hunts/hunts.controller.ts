import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'auth/jwt-auth.guard'
import { Hunt } from 'src/hunts/entities/hunt.entity'

import { CreateHuntDto } from './dto/create-hunt.dto'
import { UpdateHuntDto } from './dto/update-hunt.dto'
import { HuntsService } from './hunts.service'

@Controller('hunts')
export class HuntsController {
  constructor(private readonly huntsService: HuntsService) {}

  // TODO: add private hunts
  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Hunt[]> {
    return this.huntsService.findAll()
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createHuntDto: CreateHuntDto) {
    return this.huntsService.create(createHuntDto)
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.huntsService.findOne(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHuntDto: UpdateHuntDto) {
    return this.huntsService.update(+id, updateHuntDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.huntsService.remove(id)
  }
}
