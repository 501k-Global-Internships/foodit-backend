import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  DatabaseErrorNumber,
  ErrorMessages,
} from './constants/messages/error-messages.enum';

export class DatabaseExceptionFilter extends HttpException {
  private readonly logger: Logger;
  constructor(error: any) {
    const message: string =
      error.errno === DatabaseErrorNumber.DUPLICATE_KEY
        ? ErrorMessages.DUPLICATE_STATION_CLIENT
        : ErrorMessages.DATABASE_ERROR;
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error,
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.logger = new Logger(DatabaseExceptionFilter.name);
    this.logger.log(error);
  }
}
