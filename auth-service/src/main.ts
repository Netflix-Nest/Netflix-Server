import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './core/exception-filters';
import { LoggingInterceptor, TransformInterceptor } from './core/interceptors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
