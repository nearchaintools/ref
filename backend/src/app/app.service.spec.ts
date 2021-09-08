import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { NearService } from './near/near.service';
import { Chance } from 'chance';

const chance = new Chance();

describe('AppController', () => {
  let nearService: NearService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService, NearService],
    }).compile();

    nearService = app.get<NearService>(NearService);
  });

  // Polkadot API tests
  describe('basic chain info', () => {
    it('should return "Hello World!!!!!!"', () => {
      expect(nearService.getHello()).toBe('Hello World!!!!!!');
    });
  });
});
