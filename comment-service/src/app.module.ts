import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
