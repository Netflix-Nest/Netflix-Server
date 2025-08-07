import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  //timestamp
  @Prop()
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
