import { Module } from '@nestjs/common'
import { HuntsService } from './hunts.service'
import { HuntsController } from './hunts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Hunt } from './entities/hunt.entity'
import { HuntStepAnswer } from './entities/hunt-step-answer.entity'
import { HuntStep } from './entities/hunt-step.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Hunt, HuntStep, HuntStepAnswer])],
  controllers: [HuntsController],
  providers: [HuntsService],
})
export class HuntsModule {}
