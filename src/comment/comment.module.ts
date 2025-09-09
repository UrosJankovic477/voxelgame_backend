import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./comment.entity";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity]), NotificationModule],
    providers: [CommentService],
    controllers: [CommentController],
    exports: [CommentService]
})
export class CommentModule {
    
}