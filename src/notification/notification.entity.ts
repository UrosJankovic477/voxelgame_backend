import { CommentEntity } from "src/comment/comment.entity";
import { PostEntity } from "src/post/post.entity";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";
import { Column, Entity, IntegerType, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('notifications')
export class NotificationEntity {

    @PrimaryGeneratedColumn('increment')
    id: IntegerType;

    @JoinColumn({name: 'username'})
    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @JoinColumn({name: 'comment_uuid'})
    @OneToOne(() => CommentEntity, {
        nullable: true
    })
    comment: CommentEntity;

    @JoinColumn({name: 'voxel_build_uuid'})
    @OneToOne(() => VoxelBuildEntity, {
        nullable: true
    })
    voxelBuild: VoxelBuildEntity;

    @Column({name: 'posted'})
    posted: Date;

    @Column({name: 'read', type: 'boolean', default: false})
    read: boolean = false;

}