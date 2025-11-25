import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const body = request.body as Record<string, unknown> | undefined;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url} - User Agent: ${userAgent}`,
      'HTTP',
    );

    if (body && Object.keys(body).length > 0) {
      // Exclude sensitive data from logs
      const sanitizedBody = { ...body };
      if ('password' in sanitizedBody) {
        sanitizedBody.password = '***';
      }
      this.logger.debug(
        `Request Body: ${JSON.stringify(sanitizedBody)}`,
        'HTTP',
      );
    }

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          this.logger.log(
            `Response: ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`,
            'HTTP',
          );

          // Log response data in debug mode (be careful with sensitive data)
          if (data && typeof data === 'object') {
            const sanitizedData = { ...data } as Record<string, unknown>;
            if ('accessToken' in sanitizedData) {
              sanitizedData.accessToken = '***';
            }
            if ('refreshToken' in sanitizedData) {
              sanitizedData.refreshToken = '***';
            }
            this.logger.debug(
              `Response Data: ${JSON.stringify(sanitizedData)}`,
              'HTTP',
            );
          }
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Error: ${method} ${url} - Duration: ${duration}ms - Message: ${error.message}`,
            error.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}
