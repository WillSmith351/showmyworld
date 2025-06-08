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

    /** P2002 : unique constraint */
    if (exception.code === 'P2002') {
      const targetFields = (exception.meta?.target as string[]) || [];

      if (targetFields.includes('userId')) {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessage.PROJECT.PROJECT_USER_ALREADY_EXIST;
      } else {
        status = HttpStatus.CONFLICT;
        message = ErrorMessage.PRISMA.UNIQUE_CONSTRAINT_VIOLATION;
      }

      return response.status(status).json({
        statusCode: status,
        error: message,
      });
    }

    /** P2003 : foreign key violation */
    if (exception.code === 'P2003') {
      const constraint = exception.meta?.constraint as string;

      if (constraint?.toLowerCase().includes('userid')) {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessage.USER.USER_NOT_FOUND;
      } else if (constraint?.toLowerCase().includes('projectid')) {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessage.PROJECT.PROJET_NOT_FOUND;
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessage.PRISMA.FOREIGN_KEY_CONSTRAINT_VIOLATION;
      }

      return response.status(status).json({
        statusCode: status,
        error: message,
      });
    }

    /** P2025 : record not found for update/delete */
    if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = ErrorMessage.USER.USER_NOT_FOUND;
      return response.status(status).json({
        statusCode: status,
        error: message,
      });
    }
    /** Autres codes Prisma : on renvoie 500 */
    response.status(status).json({
      statusCode: status,
      error: message,
    });
  }
}
