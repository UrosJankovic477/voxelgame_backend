import { UUID } from "crypto";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, Int32, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('voxel_builds')
export class VoxelBuildEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: UUID;

    @Column('title')
    title: string;

    @Column('file_location')
    fileLocation: string;

    @ManyToOne(() => UserEntity, user => user.uploadedBuilds)
    user: UserEntity;
}