import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
import { Content } from 'src/content/entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actor, Content])],
  controllers: [ActorController],
  providers: [ActorService],
})
export class ActorModule {}
