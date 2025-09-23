import { NestFactory, Reflector } from "@nestjs/core";
import {
  LoggingInterceptor,
  TransformInterceptor,
} from "@netflix-clone/common";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "@netflix-clone/common";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );

  app.enableCors({
    origin: configService.get<string>("ALLOW_ORIGIN"),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  app.use(cookieParser());
  // config versioning
  app.setGlobalPrefix("api"); //api, /v nestjs auto add
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  await app.listen(configService.get<number>("PORT") || 8000);
}
bootstrap();
