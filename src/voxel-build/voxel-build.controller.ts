import { BadRequestException, Bind, Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, Req, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { UUID } from "crypto";
import { VoxelBuildService } from "src/voxel-build/voxel-build.service";
import { VoxelBuildDto } from "./voxel-build.dto";
import { UserEntity } from "src/user/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/user/user.decorator";
import { CommentService } from "src/comment/comment.service";
import { ImageFileInterceptor, PostFileInterceptor, UploadService } from "src/upload/upload.service";
import { ParseJsonPipe } from "src/parse-json-pipe/parse-json-pipe";
import { NotificationService } from "src/notification/notification.service";

@Controller('voxel-build')
export class VoxelBuildController {
    constructor(
        private voxelBuildService: VoxelBuildService, 
        private commentService: CommentService,
        private uploadService: UploadService,
        private notificationService: NotificationService
    ) {
        
    }

    @Get()
    public getBuilds(
        @Query('count') count: number = 10, 
        @Query('page') page: number = 1, 
        @Query('searchString') searchString?: string
    ) {
        if (page < 1) {
            throw new BadRequestException("Page doesn't exist");
        }
        return this.voxelBuildService.getBuilds(count, (page - 1) * count, searchString);
    }
    
    @Get(':uuid')
    public getBuild(@Param('uuid', ParseUUIDPipe) uuid: UUID) {
        return this.voxelBuildService.getBuild(uuid);
    }

    @Get(':uuid/comments')
    public getBuildComments(
        @Param('uuid', ParseUUIDPipe) uuid: UUID, 
        @Query('count', ParseIntPipe) count: number = 10, 
        @Query('page', ParseIntPipe) page: number = 1
    ) {
        if (page < 1) {
            throw new BadRequestException("Page doesn't exist");
        }
        return this.commentService.getComments(uuid, count, (page - 1) * count);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(PostFileInterceptor)
    public async createBuild(
        @Req() req, 
        @Body('voxelBuild', ParseJsonPipe) voxelBuildDto: VoxelBuildDto, 
        @UploadedFiles() files?: {
            preview: Express.Multer.File[],
            post: Express.Multer.File[],
        }
    ) {  
        const preview = files?.preview[0];
        const post = files?.post[0];
        
        const previewPictureLocation = preview ? await this.uploadService.saveImageFile(preview) : null;

        return this.voxelBuildService.saveBuild({...voxelBuildDto, previewPictureLocation}, req.user.username)
        .then(uuid => {
            if (post) {
                this.uploadService.savePostFile(post, uuid);
            }
            return uuid;
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Put()
    @UseInterceptors(PostFileInterceptor)
    public async editBuild(
        @Req() req, 
        @Body('voxelBuild', ParseJsonPipe) voxelBuildDto: VoxelBuildDto, 
        @UploadedFiles() files?: {
            preview: Express.Multer.File[],
            post: Express.Multer.File[],
        }
    ) {
        const preview = files?.preview[0];
        const post = files?.post[0];
        
        const previewPictureLocation = preview ? await this.uploadService.saveImageFile(preview) : null;

        return this.voxelBuildService.saveBuild({...voxelBuildDto, previewPictureLocation}, req.user.username, false)
        .then(uuid => {
            if (post) {
                this.uploadService.savePostFile(post, uuid);
            }
            return uuid;
        });
    }

    @Delete(':uuid')
    @UseGuards(AuthGuard('jwt'))
    public deleteBuild(@Param('uuid', ParseUUIDPipe) uuid: UUID) {
        return this.voxelBuildService.deleteBuild(uuid);
    }

    @Post(':uuid/comment')
    @UseGuards(AuthGuard('jwt'))
    public async createComment(@User() user, @Param('uuid', ParseUUIDPipe) uuid: UUID, @Body() body: {content: string}) {
        
        return await this.commentService.createComment(body.content, user.username, uuid).then(comment => 
            {
                this.voxelBuildService.getBuildUserUsername(uuid).then(
                    subscriber =>{
                        this.notificationService.postNotification({
                            sourceUuid: comment.uuid,
                            notificationType: 'comment',
                            subscribersUsernames: [subscriber]
                        });
                    }
                )
                return comment.uuid;
            }
        );
        
    }
}