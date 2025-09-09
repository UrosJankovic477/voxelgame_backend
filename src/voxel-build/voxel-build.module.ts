import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoxelBuildEntity } from "./voxel-build.entity";
import { VoxelBuildController } from "./voxel-build.controller";
import { VoxelBuildService } from "./voxel-build.service";
import { AuthModule } from "src/auth/auth.module";
import { CommentEntity } from "src/comment/comment.entity";
import { CommentModule } from "src/comment/comment.module";
import { UploadService } from "src/upload/upload.service";
import { NotificationService } from "src/notification/notification.service";
import { NotificationModule } from "src/notification/notification.module";
import { UploadModule } from "src/upload/upload.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([VoxelBuildEntity]), 
        CommentModule, 
        UploadModule, 
        NotificationModule
    ],
    providers: [VoxelBuildService],
    controllers: [VoxelBuildController],
    exports: [VoxelBuildService]

})
export class VoxelBuildModule {

}