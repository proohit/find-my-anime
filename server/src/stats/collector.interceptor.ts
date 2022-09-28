import {
  TelemetryEntry,
  TelemetrySource,
} from '@find-my-anime/shared/interfaces/AnimeDb';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { TelemetryService } from './telemetry.service';

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
    const request = _context.switchToHttp().getRequest();
    const hasCollectionConsentDefined =
      request.query.collectionConsent !== undefined;

    const collectionConsent = hasCollectionConsentDefined
      ? request.query.collectionConsent === 'true'
      : true;

    if (!collectionConsent) {
      return next.handle();
    }
    const appHost = this.configService.get('app_host');
    const telemetryEntry: TelemetryEntry = {
      data: request.query.query || request.query.id,
    };
    if (appHost) {
      if (appHost === request.headers.host) {
        this.telemetryService.saveTelemetryEntry({
          ...telemetryEntry,
          source: TelemetrySource.App,
        });
      } else {
        this.telemetryService.saveTelemetryEntry({
          ...telemetryEntry,
          source: TelemetrySource.External,
        });
      }
    } else {
      this.telemetryService.saveTelemetryEntry({
        ...telemetryEntry,
        source: TelemetrySource.Anonymous,
      });
    }

    return next.handle();
  }
}
