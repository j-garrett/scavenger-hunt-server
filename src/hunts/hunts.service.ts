import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Hunt } from 'hunts/entities/hunt.entity'
import { HuntStep } from 'hunts/entities/hunt-step.entity'
import { Repository } from 'typeorm'

import { CreateHuntDto } from './dto/create-hunt.dto'
import { UpdateHuntDto } from './dto/update-hunt.dto'

@Injectable()
export class HuntsService {
  constructor(
    @InjectRepository(Hunt)
    private readonly huntsRepository: Repository<Hunt>,
    @InjectRepository(HuntStep)
    private huntStepsRepository: Repository<HuntStep>,
  ) {}

  async create(createHuntDto: CreateHuntDto): Promise<Hunt | null> {
    console.log('createHuntDto', createHuntDto)

    const newHunt = this.huntsRepository.create({
      ...createHuntDto,
      steps: [],
    })

    const savedHunt = await this.huntsRepository.save(newHunt)
    console.log('savedHunt', savedHunt)

    const steps = createHuntDto.steps.map((step) => {
      const huntStep = this.huntStepsRepository.create(step)
      huntStep.hunt = savedHunt
      return huntStep
    })
    console.log('steps', steps)

    const savedSteps = await this.huntStepsRepository.save(steps)
    console.log('savedSteps', savedSteps)

    const response = await this.huntsRepository.findOne({
      relations: ['steps', 'steps.answer'],
      where: { id: savedHunt.id },
    })

    console.log('response', response)
    return response
  }

  async findAll(): Promise<Hunt[]> {
    return await this.huntsRepository.find()
  }

  async findOne(id: number): Promise<Hunt> {
    const hunt = await this.huntsRepository.findOne({ where: { id } })
    if (!hunt) {
      throw new Error(`Hunt with id ${id} not found`)
    }
    return hunt
  }

  async update(id: number, updateHuntDto: UpdateHuntDto): Promise<Hunt> {
    await this.huntsRepository.update(id, updateHuntDto)
    const hunt = await this.huntsRepository.findOne({ where: { id } })
    if (!hunt) {
      throw new NotFoundException(`Hunt with id ${id} not found`)
    }
    return hunt
  }

  async remove(id: number): Promise<void> {
    const result = await this.huntsRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Hunt with id ${id} not found`)
    }
  }
}
