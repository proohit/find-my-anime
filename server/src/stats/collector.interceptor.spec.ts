import { TelemetrySource } from '@find-my-anime/shared/interfaces/AnimeDb';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestCollectorInterceptor } from './collector.interceptor';
import { TelemetryService } from './telemetry.service';

describe('RequestCollectorInterceptor', () => {
  let interceptor: RequestCollectorInterceptor;
  let configService: ConfigService;
  let telemetryService: TelemetryService;
  let saveEntrySpy: jest.SpyInstance;
  let req;
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
          provide: TelemetryService,
          useValue: {
            saveTelemetryEntry: () => Promise.resolve(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<RequestCollectorInterceptor>(
      RequestCollectorInterceptor,
    );
    configService = module.get<ConfigService>(ConfigService);
    telemetryService = module.get<TelemetryService>(TelemetryService);
    req = {
      headers: {
        host: 'some host',
      },
      query: {
        query: 'sword art online',
        collectionConsent: 'true',
      },
    };
    saveEntrySpy = jest.spyOn(telemetryService, 'saveTelemetryEntry');
  });

  it('should save telemetry entry with app on matching host and collectionConsent', async () => {
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

  it('should save telemetry entry with external on non matching host and collectionConsent', async () => {
    req.headers.host = 'some other host';
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

  it('should save telemetry entry with anonymous on no configuration and collectionConsent', async () => {
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

  it('should save telemetry entry id with collectionConsent', async () => {
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

  it('should not save telemetry entry without collectionConsent', async () => {
    req.query.collectionConsent = false;
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
