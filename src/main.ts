import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { Config, HttpConfig } from './infrastructure/config';
import { Logger, LoggerErrorInterceptor, PinoLogger } from 'nestjs-pino';
import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';
import cookieParser from 'cookie-parser';

function setupApp(app: NestExpressApplication): void {
  app.enableShutdownHooks();

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new HttpException(
          errors
            .map((err: ValidationError) => Object.values(err.constraints || {}))
            .join(', '),
          HttpStatus.BAD_REQUEST,
        ),
    }),
  );
}

function setupSwagger(app: NestExpressApplication): void {
  const config = app.get(HttpConfig);

  const options = new DocumentBuilder()
    .setTitle('Ticket sales system')
    .setDescription('API for Ticket sales system')
    .setVersion('1.0')
    .addServer(config.swaggerServer)
    .build();

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, options), {
    swaggerOptions: { persistAuthorization: true },
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    await AppModule.register(),
    new ExpressAdapter(),
    {
      bufferLogs: true,
    },
  );

  const config = app.get(Config);
  const logger = await app.resolve(PinoLogger);
  logger.setContext('Ticket sales system');

  setupApp(app);
  setupSwagger(app);

  await app.listen(config.http.port, config.http.host);

  logger.info(
    'Nest application listening on %s',
    await app.getUrl(),
    'NestApplication',
  );
}
bootstrap().catch((error) => {
  console.error({ msg: 'bootstrap_error', error: (error as Error).message });
  process.exit(1);
});
