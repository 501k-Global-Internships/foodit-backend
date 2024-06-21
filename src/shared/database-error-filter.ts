import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  DatabaseErrorNumber,
  ErrorMessages,
} from './constants/messages/error-messages.enum';

export class DatabaseExceptionFilter extends HttpException {
  private readonly logger: Logger;
  constructor(error: any) {
    let message: string;
    let status: number;

    if (error.errno === DatabaseErrorNumber.DUPLICATE_KEY) {
      message = ErrorMessages.USER_EMAIL_EXISTS_ERROR;
      status = HttpStatus.BAD_REQUEST;
    } else {
      message = ErrorMessages.DATABASE_ERROR;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    super(
      {
        status,
        error: error,
        message,
      },
      status,
    );
    this.logger = new Logger(DatabaseExceptionFilter.name);
    this.logger.log(error);
  }
}
