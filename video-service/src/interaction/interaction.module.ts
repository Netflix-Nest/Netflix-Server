import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from 'src/content/entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
