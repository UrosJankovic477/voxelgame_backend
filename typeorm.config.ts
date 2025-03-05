import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mypassword',
    entities: [UserEntity, VoxelBuildEntity],
    synchronize: true
};