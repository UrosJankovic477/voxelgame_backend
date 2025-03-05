import { UserEntity } from "src/user/user.entity";
import { Entity, Int32, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('voxel_build')
export class VoxelBuildEntity {
    @PrimaryGeneratedColumn('uuid')
    id: Int32;

    @ManyToOne(() => UserEntity, user => user.uploadedBuilds)
    user: UserEntity;
}