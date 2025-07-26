import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioModule } from './minio/minio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MinioModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
