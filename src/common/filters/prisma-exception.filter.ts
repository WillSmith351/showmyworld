import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { ErrorMessage } from '../messages/error.message';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ErrorMessage.PRISMA.UNEXPECTED_ERROR;

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = ErrorMessage.PRISMA.UNIQUE_CONSTRAINT_VIOLATION;
    } else if (exception.code === 'P2003') {
      status = HttpStatus.BAD_REQUEST;
      message = ErrorMessage.PRISMA.FOREIGN_KEY_CONSTRAINT_VIOLATION;
    } else if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = ErrorMessage.USER.USER_NOT_FOUND;
    }

    response.status(status).json({
      statusCode: status,
      error: message,
    });
  }
}
