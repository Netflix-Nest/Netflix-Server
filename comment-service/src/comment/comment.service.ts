import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from '@netflix-clone/types';
import { UpdateCommentDto } from '@netflix-clone/types';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: SoftDeleteModel<CommentDocument>,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async validateReplyDepth(parentId: string) {
    let current = await this.commentModel.findOne({ _id: parentId });
    let depth = 1;
    while (current?.parentId) {
      current = await this.commentModel.findOne({ _id: current.parentId });
      depth++;
      if (depth >= 3) break;
    }

    if (depth >= 3) {
      throw new BadRequestException('Only allow up to 3 reply levels.');
    }
  }

  buildCommentTree(comments: Comment[]): Comment[] {
    const map = new Map<string, any>();

    comments.forEach((comment: any) => {
      (comment as any).replies = [];
      map.set(comment._id.toString(), comment);
    });

    function attachChild(parent: any, child: any, level: number) {
      if (level >= 3) return;
      parent.replies.push(child);
    }

    const roots: any[] = [];

    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = map.get(comment.parentId.toString());
        if (parent) {
          const level = getDepth(parent);
          attachChild(parent, comment, level);
        }
      } else {
        roots.push(comment);
      }
    });

    function getDepth(comment: any): number {
      let depth = 1;
      let current = comment;
      while (current.parentId) {
        const p = map.get(current.parentId.toString());
        if (!p) break;
        depth++;
        current = p;
      }
      return depth;
    }

    return roots;
  }

  // func create detect comment mention to who people
  // todo: send notification to people who are mentioned
  async detectMention(content: string) {
    const mentionMatches = content.match(/@([a-zA-Z0-9_]+)/g) || [];
    const usernames = mentionMatches.map((m) => m.substring(1));
    if (usernames.length === 0) return [];
    // Fetch user from user service
    const qs = 'username=' + usernames.join(',');
    const users = await lastValueFrom(
      this.userClient.send('find-users', {
        currentPage: 1,
        limit: usernames.length,
        qs,
      }),
    );
    const mentionIds = users.data.map((u) => u.id);
    return mentionIds;
  }

  async create(createCommentDto: CreateCommentDto) {
    const mentionIds = await this.detectMention(createCommentDto.content);
    if (createCommentDto.parentId) {
      await this.validateReplyDepth(createCommentDto.parentId);
    }
    // Todo: notification to user is mentioned
    const comment = await this.commentModel.create({
      content: createCommentDto.content,
      mentions: mentionIds,
      userId: createCommentDto.userId,
      videoId: createCommentDto.contentId,
      parentId: createCommentDto.parentId || null,
    });
    return comment;
  }

  async findAll(currentPage: number, limit: number, content: number) {
    const roots = await this.commentModel
      .find({ parentId: null, contentId: content })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean();
    const rootIds = roots.map((r) => r._id);

    const replies = await this.commentModel
      .find({
        parentId: { $in: rootIds },
      })
      .lean();

    const repliesIds = replies.map((r) => r._id);

    const replies2 = await this.commentModel.find({
      parentId: { $in: repliesIds },
      contentId: content,
    });

    const allComments = [...roots, ...replies, ...replies2];

    return this.buildCommentTree(allComments);
  }

  async findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const cmt = await this.commentModel.findOne({ _id: id });
    if (cmt?.userId !== updateCommentDto.userId) {
      throw new RpcException('UserId does not match !');
    }
    const mentionIds = await this.detectMention(updateCommentDto.content);
    return this.commentModel.updateOne(
      { _id: id },
      { content: updateCommentDto.content, mentions: mentionIds },
    );
  }

  async remove(id: string) {
    return this.commentModel.delete({ _id: id });
  }
}
