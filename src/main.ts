import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port, () => {
    Logger.log(`payments microservice running on port: ${envs.port}`);
  });
}
bootstrap();
