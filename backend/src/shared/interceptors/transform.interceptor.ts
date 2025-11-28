import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => {
        let message: string | undefined;
        if (typeof data === 'object' && data !== null && 'message' in data) {
          const dataWithMessage = data as { message?: string };
          message = dataWithMessage.message;
        }
        return {
          success: true,
          data,
          message,
        };
      }),
    );
  }
}
