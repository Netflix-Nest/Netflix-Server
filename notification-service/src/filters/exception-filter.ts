import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToRpc();

    if (exception instanceof RpcException) {
      this.logger.error('RPC Exception:', exception.message);
      return exception.getError();
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      this.logger.error('HTTP Exception in microservice:', res);
      return res;
    }

    this.logger.error('Unexpected error in microservice:', exception);
    return { message: 'Internal server error', statusCode: 500 };
  }
}
