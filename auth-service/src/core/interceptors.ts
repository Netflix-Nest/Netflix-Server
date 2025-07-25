import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query } = req;

    const now = Date.now();

    this.logger.log(
      `[Request] ${method} ${originalUrl} | query=${JSON.stringify(
        query,
      )} | body=${JSON.stringify(body)}`,
    );

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.log(
            `[Response] ${method} ${originalUrl} | ${
              Date.now() - now
            }ms | response=${JSON.stringify(data)}`,
          ),
        ),
      );
  }
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    return next.handle().pipe(
      map((data) => ({
        statusCode: response.status,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
