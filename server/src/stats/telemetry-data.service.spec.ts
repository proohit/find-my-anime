/* eslint-disable @typescript-eslint/unbound-method */
import {
  TelemetryEntry,
  TelemetrySource,
} from '@find-my-anime/shared/interfaces/AnimeDb';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, UpdateResult } from 'mongoose';
import { mockTelemetry } from '../../test/mockData';
import { TelemetryDataModel } from '../animedb/schemas/telemetry-data.schema';
import { TelemetryDataService } from './telemetry-data.service';

describe('TelemetryDataService', () => {
  let telemetryDataService: TelemetryDataService;
  let telemetryDataModel: jest.Mocked<Model<TelemetryDataModel>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryDataService,
        {
          provide: getModelToken(TelemetryDataModel.name),
          useValue: {
            find: () => ({
              exec: jest.fn().mockResolvedValue(mockTelemetry),
            }),
            updateOne: jest.fn().mockResolvedValue(undefined),
            create: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    telemetryDataService = module.get(TelemetryDataService);
    telemetryDataModel = module.get(getModelToken(TelemetryDataModel.name));
  });

  describe('incrementTelemetryEntry', () => {
    const testEntry: TelemetryEntry = { ...mockTelemetry[0] };

    it('should increase count on existing entry', async () => {
      telemetryDataModel.updateOne.mockResolvedValue({
        matchedCount: 1,
      } as UpdateResult);
      await telemetryDataService.incrementTelemetryEntry(testEntry);
      expect(telemetryDataModel.updateOne).toHaveBeenLastCalledWith(
        { data: testEntry.data, source: testEntry.source },
        { $inc: { count: 1 } },
      );
      expect(telemetryDataModel.create).not.toHaveBeenCalled();
    });

    it('should increase count on existing entry with matching sources only', async () => {
      const changedTestEntry: TelemetryEntry = {
        ...testEntry,
        source: TelemetrySource.App,
      };
      telemetryDataModel.updateOne.mockResolvedValue({
        matchedCount: 1,
      } as UpdateResult);
      await telemetryDataService.incrementTelemetryEntry(changedTestEntry);
      expect(telemetryDataModel.updateOne).toHaveBeenLastCalledWith(
        { data: changedTestEntry.data, source: changedTestEntry.source },
        { $inc: { count: 1 } },
      );
      expect(telemetryDataModel.create).not.toHaveBeenCalled();
    });

    it('should create new entry if no existing entry matches', async () => {
      telemetryDataModel.updateOne.mockResolvedValue({
        matchedCount: 0,
      } as UpdateResult);
      await telemetryDataService.incrementTelemetryEntry(testEntry);
      expect(telemetryDataModel.updateOne).toHaveBeenLastCalledWith(
        { data: testEntry.data, source: testEntry.source },
        { $inc: { count: 1 } },
      );
      expect(telemetryDataModel.create).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: testEntry.data,
          count: 1,
        }),
      );
    });
  });

  describe('getAnimeDbWithTelemetry', () => {
    it('should return telemetry', async () => {
      const telemetry = await telemetryDataService.getTelemetryData();
      expect(telemetry).toEqual(mockTelemetry);
    });
  });
});
