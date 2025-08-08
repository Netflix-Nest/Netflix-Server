import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Mongoose,
  ObjectId,
  Types,
} from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop()
  userId: number;

  @Prop()
  content: string;

  @Prop()
  contentId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  parentId: mongoose.Schema.Types.ObjectId | null;

  @Prop()
  mentions: number[];
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
