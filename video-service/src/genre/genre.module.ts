import { forwardRef, Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), forwardRef(() => ContentModule)],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
