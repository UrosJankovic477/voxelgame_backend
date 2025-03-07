import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoxelBuildEntity } from "./voxel-build.entity";
import { VoxelBuildController } from "./voxel-build.controller";
import { VoxelBuildService } from "./voxel-build.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([VoxelBuildEntity]), AuthModule],
    providers: [VoxelBuildService],
    controllers: [VoxelBuildController],

})
export class VoxelBuildModule {

}