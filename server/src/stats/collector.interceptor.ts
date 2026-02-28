import {
  TelemetryEntry,
  TelemetrySource,
} from '@find-my-anime/shared/interfaces/AnimeDb';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { TelemetryService } from './telemetry.service';
import { Request } from 'express';
export type AnimeRequestType = Request<
  unknown,
  unknown,
  unknown,
  {
    query?: string;
    id?: string;
    collectionConsent?: string;
  }
>;

@Injectable()
export class RequestCollectorInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService,
    private telemetryService: TelemetryService,
  ) {}
  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request: AnimeRequestType = _context.switchToHttp().getRequest();
    const hasCollectionConsentDefined =
      request.query.collectionConsent !== undefined;

    const collectionConsent = hasCollectionConsentDefined
      ? request.query.collectionConsent === 'true'
      : true;

    if (!collectionConsent) {
      return next.handle();
    }
    const appHost: string | undefined = this.configService.get('app_host');
    if (!appHost) {
      Logger.warn(
        'App host is not defined. Telemetry entries will be marked as anonymous',
      );
    }

    const queryOrId = request.query.query || request.query.id;
    if (!queryOrId) {
      Logger.warn(
        'No query or id parameter found in the request. Telemetry entry will have empty data field',
      );

      return next.handle();
    }

    const telemetryEntry: TelemetryEntry = { data: queryOrId };
    if (appHost) {
      if (appHost === request.headers.host) {
        void this.telemetryService.saveTelemetryEntry({
          ...telemetryEntry,
          source: TelemetrySource.App,
        });
      } else {
        void this.telemetryService.saveTelemetryEntry({
          ...telemetryEntry,
          source: TelemetrySource.External,
        });
      }
    } else {
      void this.telemetryService.saveTelemetryEntry({
        ...telemetryEntry,
        source: TelemetrySource.Anonymous,
      });
    }

    return next.handle();
  }
}
