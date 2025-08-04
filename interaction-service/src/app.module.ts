import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InteractionModule } from './interaction/interaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InteractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
