import { Injectable } from '@nestjs/common';
import { CreateHuntDto } from './dto/create-hunt.dto';
import { UpdateHuntDto } from './dto/update-hunt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DeepPartial, Repository } from 'typeorm';
import { Hunt } from 'src/hunts/entities/hunt.entity';

@Injectable()
export class HuntsService {
  constructor(
    @InjectRepository(Hunt)
    private readonly huntRepository: Repository<Hunt>,
    private readonly connection: Connection,
  ) {}

  async create(createHuntDto: CreateHuntDto): Promise<Hunt> {
    const newHunt = this.huntRepository.create(
      // TODO: update entity to match the dto
      createHuntDto as unknown as DeepPartial<Hunt>,
    );
    return await this.huntRepository.save(newHunt);
  }

  async findAll(): Promise<Hunt[]> {
    return await this.huntRepository.find();
  }

  async findOne(id: number): Promise<Hunt> {
    const hunt = await this.huntRepository.findOne({ where: { id } });
    if (!hunt) {
      throw new Error(`Hunt with id ${id} not found`);
    }
    return hunt;
  }

  update(id: number, updateHuntDto: UpdateHuntDto) {
    return `This action updates a #${id} hunt`;
  }

  remove(id: number) {
    return `This action removes a #${id} hunt`;
  }
}
