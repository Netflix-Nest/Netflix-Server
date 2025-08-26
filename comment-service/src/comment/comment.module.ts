import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserClientModule } from '@netflix-clone/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UserClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        host: cfg.get<string>('REDIS_HOST') || 'netflix-redis',
        port: cfg.get<number>('REDIS_PORT') || 6379,
        password: cfg.get<string>('REDIS_PASSWORD'),
      }),
    }),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
