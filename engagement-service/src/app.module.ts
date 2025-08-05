import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EngagementModule } from './engagement/engagement.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './engagement/entities/watchlist.entity';
import { History } from './engagement/entities/history.entity';
import { Bookmark } from './engagement/entities/bookmark.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: 5432,
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [Watchlist, History, Bookmark],
        synchronize: true,
        ssl: true,
      }),
    }),
    EngagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
