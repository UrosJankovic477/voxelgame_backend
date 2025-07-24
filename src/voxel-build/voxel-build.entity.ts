import { UUID } from "crypto";
import { CommentEntity } from "src/comment/comment.entity";
import { PostEntity } from "src/post/post.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('voxel_builds')
export class VoxelBuildEntity extends PostEntity {

    @Column({name: 'title', length: 256})
    title: string;

    @Column({name: 'description'})
    description: string;

    @Column({
        name: 'preview_picture_location', 
        type: "varchar",
        default: null, 
        nullable: true,
    })
    previewPictureLocation: string | null;

    @ManyToOne(() => UserEntity, user => user.uploadedBuilds, {
        onDelete: 'SET NULL',
        nullable: true
    })
    user: UserEntity;

    @OneToMany(() => CommentEntity, comment => comment.voxelBuild)
    comments: CommentEntity[];
}