import { TelemetrySource } from '@find-my-anime/shared/interfaces/AnimeDb';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AnimeRequestType,
  RequestCollectorInterceptor,
} from './collector.interceptor';
import { Request } from 'express';
import { TelemetryDataService } from './telemetry-data.service';

describe('RequestCollectorInterceptor', () => {
  let interceptor: RequestCollectorInterceptor;
  let configService: ConfigService;
  let telemetryDataService: TelemetryDataService;
  let saveEntrySpy: jest.SpyInstance;
  let req: AnimeRequestType;
  const nextFnMock = {
    handle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestCollectorInterceptor,
        {
          provide: ConfigService,
          useValue: {
            get: () => undefined,
          },
        },
        {
          provide: TelemetryDataService,
          useValue: {
            incrementTelemetryEntry: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    interceptor = module.get(RequestCollectorInterceptor);
    configService = module.get(ConfigService);
    telemetryDataService = module.get(TelemetryDataService);
    req = {
      headers: {
        origin: 'some host',
      },
      query: {
        query: 'sword art online',
        collectionConsent: 'true',
      },
    } as unknown as Request;
    saveEntrySpy = jest.spyOn(telemetryDataService, 'incrementTelemetryEntry');
  });

  it('should save telemetry entry with app on matching host and collectionConsent', () => {
    jest.spyOn(configService, 'get').mockReturnValue('some host');
    interceptor.intercept(
      {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
      } as ExecutionContext,
      nextFnMock,
    );
    expect(saveEntrySpy).toHaveBeenCalledWith({
      data: req.query.query,
      source: TelemetrySource.App,
    });
  });

  it('should save telemetry entry with external on non matching host and collectionConsent', () => {
    req.headers.origin = 'some other host';
    jest.spyOn(configService, 'get').mockReturnValue('some host');
    interceptor.intercept(
      {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
      } as ExecutionContext,
      nextFnMock,
    );
    expect(saveEntrySpy).toHaveBeenCalledWith({
      data: req.query.query,
      source: TelemetrySource.External,
    });
  });

  it('should save telemetry entry with anonymous on no configuration and collectionConsent', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    interceptor.intercept(
      {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
      } as ExecutionContext,
      nextFnMock,
    );
    expect(saveEntrySpy).toHaveBeenCalledWith({
      data: req.query.query,
      source: TelemetrySource.Anonymous,
    });
  });

  it('should save telemetry entry id with collectionConsent', () => {
    delete req.query.query;
    req.query.id = '123';
    interceptor.intercept(
      {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
      } as ExecutionContext,
      nextFnMock,
    );
    expect(saveEntrySpy).toHaveBeenCalledWith({
      data: req.query.id,
      source: TelemetrySource.Anonymous,
    });
  });

  it('should not save telemetry entry without collectionConsent', () => {
    req.query.collectionConsent = 'false';
    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    interceptor.intercept(
      {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
      } as ExecutionContext,
      nextFnMock,
    );
    expect(saveEntrySpy).not.toHaveBeenCalled();
  });
});
