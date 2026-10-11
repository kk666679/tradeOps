import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: AppController;
  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    app = mod.get(AppController);
  });
  it('root', () => {
    expect(app.root()).toMatchObject({ ok: true });
  });
});
