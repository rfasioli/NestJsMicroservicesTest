import { Test, TestingModule } from '@nestjs/testing';
import { SpringCloudConfigService } from './spring-cloud-config.service';

describe('SpringCloudConfigService', () => {
  let service: SpringCloudConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpringCloudConfigService],
    }).compile();

    service = module.get<SpringCloudConfigService>(SpringCloudConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
