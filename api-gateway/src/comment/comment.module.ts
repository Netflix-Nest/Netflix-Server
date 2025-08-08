import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentClientProvider } from "src/client/comment-client.provider";

@Module({
	controllers: [CommentController],
	providers: [CommentClientProvider],
})
export class CommentModule {}
