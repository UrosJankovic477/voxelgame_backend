import { UUID } from "crypto";
import { PostEntity } from "src/post/post.entity";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('comments')
export class CommentEntity extends PostEntity {

    @Column({name: 'content'})
    content: string;

    @DeleteDateColumn()
    deleted: Date | null;

    @ManyToOne(() => VoxelBuildEntity, voxelBuild => voxelBuild.comments, {
        nullable: true,
        
    })
    voxelBuild: VoxelBuildEntity | null;

    @ManyToOne(() => UserEntity, user => user.comments, {
        onDelete: 'SET NULL',
        nullable: true
    })
    user: UserEntity;

    @OneToMany(() => CommentEntity, comment => comment.parent)
    replies: CommentEntity[];

    @ManyToOne(() => CommentEntity, comment => comment.replies)
    parent: CommentEntity;
}