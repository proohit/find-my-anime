import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as rxjs from 'rxjs';
import { AniDbClient } from './anidb-client.service';
jest.mock('rxjs', () => ({
  lastValueFrom: jest.fn(),
}));
describe('AniDBClient', () => {
  const givenDescription = 'test';
  let aniDbClient: AniDbClient;
  beforeEach(async () => {
    (rxjs.lastValueFrom as jest.Mock).mockReturnValue(
      Promise.resolve({
        data: `
        <?xml version="1.0" encoding="UTF-8"?>
        <anime id="1234" restricted="false">
            <description>${givenDescription}</description>
        </anime>`,
      }),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AniDbClient,
        {
          provide: HttpService,
          useValue: {
            get: () => jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => 'test',
          },
        },
      ],
    }).compile();
    aniDbClient = module.get<AniDbClient>(AniDbClient);
  });

  describe('getAnime', () => {
    it('should return anime', async () => {
      const results = await aniDbClient.getAnime('1234');
      expect(results.description).toBeDefined();
      expect(results.description).toEqual(givenDescription);
    });

    it('should handle error if AniDB API returned an error', async () => {
      const givenErrorMessage = 'AniDB API returned an error';
      (rxjs.lastValueFrom as jest.Mock).mockReturnValue(
        Promise.resolve({
          data: `<error>${givenErrorMessage}</error>`,
        }),
      );
      expect(() => aniDbClient.getAnime('1234')).not.toThrow();
    });
  });
});
