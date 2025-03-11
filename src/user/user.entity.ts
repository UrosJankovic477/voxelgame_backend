import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";
import { Column, Entity, Int32, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { CommentEntity } from "src/comment/comment.entity";


@Entity('users')
export class UserEntity {

    @PrimaryColumn({length: 32, name: 'username'})
    username: string;

    @Column({length: 32, name: 'displayname'})
    displayname: string;

    @Column({length: 256, name: 'about', default: ""})
    about: string;

    @Column({name: 'profile_picture_location', default: ""})
    profilePictureLocation: string;

    @Column({name: 'password_hash'})
    passwordHash: string;

    @OneToMany(() => VoxelBuildEntity, voxelBuild => voxelBuild.user)
    uploadedBuilds: VoxelBuildEntity[];

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[];

}