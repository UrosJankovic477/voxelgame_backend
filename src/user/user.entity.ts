import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";
import { Column, Entity, Int32, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: Int32;

    @Column()
    userName: string;

    @Column()
    displayName: string;

    @Column()
    biography: string;

    @Column()
    profilePictureLocation: string;

    @Column()
    passwordHash: string;

    @OneToMany(() => VoxelBuildEntity, voxelBuild => voxelBuild.user)
    uploadedBuilds: VoxelBuildEntity[];

}