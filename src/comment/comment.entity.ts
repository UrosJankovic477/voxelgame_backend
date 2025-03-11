import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";
import { Column, Entity, IntegerType, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('comment')
export class CommentEntity {
    
    @PrimaryGeneratedColumn('increment')
    id: IntegerType;

    @Column({name: 'content'})
    content: string;

    @ManyToOne(() => VoxelBuildEntity, voxelBuild => voxelBuild.comments)
    voxelBuild: VoxelBuildEntity;

    @ManyToOne(() => UserEntity, user => user.comments)
    user: UserEntity;

    @OneToMany(() => CommentEntity, comment => comment.replies)
    replies: CommentEntity[];
}