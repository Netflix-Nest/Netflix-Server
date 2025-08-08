import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'netflix-redis',
      port: parseInt(process.env.REDIS_PORT!) || 6379,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(
    process.env.PORT ? Number(process.env.PORT) : 3000,
    '0.0.0.0',
  );

  console.log(`HTTP server is running on port ${process.env.PORT ?? 3000}`);
  console.log(
    `Microservice Redis is running on port ${process.env.MS_PORT ?? 4000}`,
  );
}
bootstrap();
