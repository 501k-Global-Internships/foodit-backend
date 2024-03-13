import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Get ConfigService Instance
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') as number;

  // Setup Global pipe for Validation
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('FOODIT')
    .setDescription('FOODIT API Documentation')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, async () =>
    console.log(`Server is running 🚀🚀🚀 on: ${await app.getUrl()}`),
  );
}
bootstrap();
