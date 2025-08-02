import { forwardRef, Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
import { Content } from 'src/content/entities/content.entity';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actor, Content]),
    forwardRef(() => ContentModule),
  ],
  controllers: [ActorController],
  providers: [ActorService],
  exports: [ActorService],
})
export class ActorModule {}
