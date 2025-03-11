import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CommentService } from "src/comment/comment.service";
import { User } from "src/user/user.decorator";

@Controller('comment')
export class CommentController {
    constructor(private service: CommentService) {
        
    }
    
    @Get(':id')
    public getCommentReplies(@Param('id', ParseIntPipe) id: number, @Query('count') count: number = 10, @Query('page') page: number = 1) {
        if (page < 1) {
            throw new UnauthorizedException("The page doesn't exist");
        }
        return this.service.getCommentReplies(id, count, page * count);
    }
    
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    public deleteComment(@Param('id', ParseIntPipe) id: number, @User() user) {
        return this.service.deleteComment(id, user.username);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    public editComment(@Param('id', ParseIntPipe) id: number, @User() user, @Body() content: string) {
        return this.service.editComment(id, content, user.username)
    }
    
}