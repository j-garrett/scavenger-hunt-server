import { Test, TestingModule } from '@nestjs/testing';
import { HuntsController } from './hunts.controller';
import { HuntsService } from './hunts.service';

describe('HuntsController', () => {
  let controller: HuntsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HuntsController],
      providers: [HuntsService],
    }).compile();

    controller = module.get<HuntsController>(HuntsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
