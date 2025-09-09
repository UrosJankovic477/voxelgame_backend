import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UUID } from "crypto";
import { CommentService } from "src/comment/comment.service";
import { NotificationService } from "src/notification/notification.service";
import { User } from "src/user/user.decorator";

@Controller('comment')
export class CommentController {
    constructor(
        private commentService: CommentService,
        private notificationService: NotificationService
    ) {
        
    }

    @Post(':uuid')
    @UseGuards(AuthGuard('jwt'))
    public async postReply(@Param('uuid', ParseUUIDPipe) uuid: UUID, @User() user, @Body('content') content: string) {
        const subscriber = await this.commentService.getCommentUsername(uuid);
        return this.commentService.postReply(content, user.username, uuid).then(replyUuid => 
            {
                this.notificationService.postNotification({
                    sourceUuid: replyUuid,
                    notificationType: 'comment',
                    subscribersUsernames: [subscriber]
                });
                return replyUuid;
            }
        );
    }
    
    @Get(':uuid/replies')
    public getCommentReplies(@Param('uuid', ParseUUIDPipe) uuid: UUID, @Query('count') count: number = 10, @Query('page') page: number = 1) {
        if (page < 1) {
            throw new UnauthorizedException("The page doesn't exist");
        }
        return this.commentService.getCommentReplies(uuid, count, (page - 1) * count);
    }
    
    @Delete(':uuid')
    @UseGuards(AuthGuard('jwt'))
    public deleteComment(@Param('uuid', ParseUUIDPipe) uuid: UUID, @User() user) {
        return this.commentService.deleteComment(uuid, user.username);
    }

    @Put(':uuid')
    @UseGuards(AuthGuard('jwt'))
    public editComment(@Param('uuid', ParseUUIDPipe) uuid: UUID, @User() user, @Body('content') content: string) {
        return this.commentService.editComment(uuid, content, user.username)
    }


    
}