import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UUID } from "crypto";
import { VoxelBuildService } from "src/voxel-build/voxel-build.service";
import { VoxelBuildDto } from "./voxel-build.dto";
import { UserEntity } from "src/user/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/user/user.decorator";
import { CommentService } from "src/comment/comment.service";

@Controller('voxel-build')
export class VoxelBuildController {
    constructor(private service: VoxelBuildService, private commentService: CommentService) {
        
    }

    @Get()
    public getBuilds(@Query('count') count: number = 10, @Query('page') page: number = 1) {
        if (page < 1) {
            throw new BadRequestException("Page doesn't exist");
        }
        return this.service.getBuilds(count, (page - 1) * count);
    }
    
    @Get(':uuid')
    public getBuild(@Param('uuid', ParseUUIDPipe) uuid: UUID) {
        return this.service.getBuild(uuid);
    }

    @Get(':uuid/comments')
    public getBuildComments(@Param('uuid', ParseUUIDPipe) uuid: UUID, @Query('count') count: number = 10, @Query('page') page: number = 1) {
        if (page < 1) {
            throw new BadRequestException("Page doesn't exist");
        }
        return this.service.getBuildComments(uuid, count, page * count);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    public createBuild(@Body() voxelBuildDto: VoxelBuildDto, @User() user) {
        return this.service.createBuild(voxelBuildDto, user);
    }

    @Delete(':uuid')
    @UseGuards(AuthGuard('jwt'))
    public deleteBuild(@Param('uuid', ParseUUIDPipe) uuid: UUID) {
        return this.service.deleteBuild(uuid);
    }

    @Post(':uuid/comment')
    @UseGuards(AuthGuard('jwt'))
    public async createComment(@User() user, @Param('uuid', ParseUUIDPipe) uuid: UUID, @Body() content: string) {
        const voxelBuild = await this.service.getBuild(uuid);
        if (!voxelBuild) {
            throw new BadRequestException("Post doesn't exist");
        }
        return await this.commentService.createComment(content, user, voxelBuild);
        
    }
}