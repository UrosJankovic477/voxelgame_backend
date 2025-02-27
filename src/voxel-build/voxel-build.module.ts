import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoxelBuildEntity } from "./voxel-build.entity";

@Module({
    imports: [TypeOrmModule.forFeature([VoxelBuildEntity])],
    exports: [TypeOrmModule]
})
export class Model3DModule {

}