import { Module } from '@nestjs/common';
import { HuntsService } from './hunts.service';
import { HuntsController } from './hunts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hunt } from 'src/hunts/entities/hunt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hunt])],
  controllers: [HuntsController],
  providers: [HuntsService],
})
export class HuntsModule {}
