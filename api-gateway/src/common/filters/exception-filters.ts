import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { RpcException } from "@nestjs/microservices";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctxType = host.getType();

    if (ctxType === "http") {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : (exception as any)?.message || "Internal server error";

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: message,
      });
    }

    if (ctxType === "rpc") {
      const errorResponse =
        exception instanceof RpcException
          ? exception.getError()
          : (exception as any)?.message || "Internal RPC error";

      console.error("[RPC Exception]", errorResponse);

      if (!(exception instanceof RpcException)) {
        throw new RpcException(errorResponse);
      }

      throw exception;
    }
  }
}
