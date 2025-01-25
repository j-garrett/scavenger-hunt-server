import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Hunt } from './entities/hunt.entity'
import { HuntStep } from './entities/hunt-step.entity'
import { HuntStepAnswer } from './entities/hunt-step-answer.entity'
import { HuntsController } from './hunts.controller'
import { HuntsService } from './hunts.service'

@Module({
  controllers: [HuntsController],
  imports: [TypeOrmModule.forFeature([Hunt, HuntStep, HuntStepAnswer])],
  providers: [HuntsService],
})
export class HuntsModule {}
