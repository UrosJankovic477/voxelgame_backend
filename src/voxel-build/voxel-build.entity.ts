import { UUID } from "crypto";
import { CommentEntity } from "src/comment/comment.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('voxel_builds')
export class VoxelBuildEntity {
    @PrimaryGeneratedColumn('uuid', {
        name: 'build_uuid'
    })
    uuid: UUID;

    @Column({name: 'title', length: 256})
    title: string;

    @Column({name: 'description'})
    description: string;

    @Column({name: 'preview_picture_location', default: ""})
    previewPictureLocation: string;

    @Column({name: 'file_location'})
    fileLocation: string;

    @OneToMany(() => CommentEntity, comment => comment.voxelBuild)
    comments: CommentEntity[];

    @ManyToOne(() => UserEntity, user => user.uploadedBuilds)
    user: UserEntity;
}