import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoxelBuildEntity } from "./voxel-build.entity";
import { VoxelBuildController } from "./voxel-build.controller";
import { VoxelBuildService } from "./voxel-build.service";
import { AuthModule } from "src/auth/auth.module";
import { CommentEntity } from "src/comment/comment.entity";
import { CommentModule } from "src/comment/comment.module";

@Module({
    imports: [TypeOrmModule.forFeature([VoxelBuildEntity]), CommentModule],
    providers: [VoxelBuildService],
    controllers: [VoxelBuildController],

})
export class VoxelBuildModule {

}