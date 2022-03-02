import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionResponse } from '../ExceptionResponse';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    catch (exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response<ExceptionResponse>>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            status,
            timestamp: new Date().toISOString(),
            url: request.url,
            message: exception instanceof HttpException ? exception.message : `Internal server error: ${(exception as any).message}`
        });
    }
}