import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Hunt } from 'hunts/entities/hunt.entity'
import { Repository } from 'typeorm'

import { CreateHuntDto } from './dto/create-hunt.dto'
import { UpdateHuntDto } from './dto/update-hunt.dto'

@Injectable()
export class HuntsService {
  constructor(
    @InjectRepository(Hunt)
    private readonly huntRepository: Repository<Hunt>,
  ) {}

  async create(createHuntDto: CreateHuntDto): Promise<Hunt> {
    const newHunt = this.huntRepository.create(createHuntDto)
    return await this.huntRepository.save(newHunt)
  }

  async findAll(): Promise<Hunt[]> {
    return await this.huntRepository.find()
  }

  async findOne(id: number): Promise<Hunt> {
    const hunt = await this.huntRepository.findOne({ where: { id } })
    if (!hunt) {
      throw new Error(`Hunt with id ${id} not found`)
    }
    return hunt
  }

  async update(id: number, updateHuntDto: UpdateHuntDto): Promise<Hunt> {
    await this.huntRepository.update(id, updateHuntDto)
    const hunt = await this.huntRepository.findOne({ where: { id } })
    if (!hunt) {
      throw new NotFoundException(`Hunt with id ${id} not found`)
    }
    return hunt
  }

  async remove(id: number): Promise<void> {
    const result = await this.huntRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Hunt with id ${id} not found`)
    }
  }
}
