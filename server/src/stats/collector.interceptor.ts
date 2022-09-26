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
    const collectionConsent =
      (request.query.collectionConsent &&
        request.query.collectionConsent === 'true') ||
      true;
    if (!collectionConsent) {
      return next.handle();
    }
    const appHost = this.configService.get('app_host');
    const telemetryEntry: TelemetryEntry = {
      data: request.query.query,
    };
    if (appHost) {
      if (appHost === request.headers.origin) {
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
