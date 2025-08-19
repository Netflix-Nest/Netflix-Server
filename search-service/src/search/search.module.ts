import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        node: cfg.get('ELASTIC_NODE') || 'http://localhost:9200',
        // enable xpack security in prod is needed:
        // auth: { username: cfg.get('ELASTIC_USER'), password: cfg.get('ELASTIC_PASS') },
        // tls: { rejectUnauthorized: false },
      }),
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
