import 'dotenv/config';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseError =
      exception instanceof BadRequestException
        ? this.formatValidationErrors(exception.getResponse())
        : exception.message;

    const devErrorResponse: any = {
      success: false,
      error: {
        code: status,
        responseMessage: responseError,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    };

    const prodErrorResponse: any = {
      success: false,
      error: {
        responseMessage: responseError,
      },
    };

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(devErrorResponse),
      'ExceptionFilter',
    );
    response
      .status(status)
      .json(
        process.env.APP_ENV === 'dev' ? devErrorResponse : prodErrorResponse,
      );
  }

  private formatValidationErrors(response: any): string | any {
    if (response && Array.isArray(response.message)) {
      return response.message.map((msg: string) => msg);
    }
    return response;
  }
}
