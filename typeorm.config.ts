import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CommentEntity } from "src/comment/comment.entity";
import { NotificationEntity } from "src/notification/notification.entity";
import { PostEntity } from "src/post/post.entity";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: '192.168.1.195',
    port: 5432,
    username: 'postgres',
    password: process.env.password,
    entities: [
        UserEntity, 
        VoxelBuildEntity, 
        CommentEntity, 
        NotificationEntity,
    ],
    synchronize: true
};