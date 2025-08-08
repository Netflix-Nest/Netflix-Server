import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll(
    @Query('currentPage') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.commentService.findAll(currentPage, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  @MessagePattern('create-comment')
  createComment(@Payload() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @MessagePattern('get-comments')
  getComments(
    @Payload() { currentPage, limit }: { currentPage: number; limit: number },
  ) {
    return this.commentService.findAll(currentPage, limit);
  }

  @MessagePattern('update-comment')
  updateComment(
    @Payload()
    {
      id,
      updateCommentDto,
    }: {
      id: string;
      updateCommentDto: UpdateCommentDto;
    },
  ) {
    return this.commentService.update(id, updateCommentDto);
  }

  @MessagePattern('delete-comment')
  deleteComment(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
