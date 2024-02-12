import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const configService: ConfigService = app.get(ConfigService);
  const config: ConfigType<typeof appConfig> = configService.get('app');
  const logger = new Logger(bootstrap.name);
  await app.listen(config.port);
  logger.log(`Server executed on port:${config.port}`);
}
bootstrap();
