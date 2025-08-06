import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EngagementModule } from './engagement/engagement.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './watchlist/entities/watchlist.entity';
import { History } from './history/entities/history.entity';
import { Bookmark } from './bookmark/entities/bookmark.entity';
import { HistoryModule } from './history/history.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { BookmarkModule } from './bookmark/bookmark.module';

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
    HistoryModule,
    WatchlistModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
