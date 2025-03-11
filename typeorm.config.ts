import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CommentEntity } from "src/comment/comment.entity";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mypassword',
    entities: [UserEntity, VoxelBuildEntity, CommentEntity],
    synchronize: true
};