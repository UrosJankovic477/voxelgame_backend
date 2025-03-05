import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";
import { Column, Entity, Int32, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: Int32;

    @Column({length: 32, name: 'username', unique: true})
    username: string;

    @Column({length: 32, name: 'displayname'})
    displayname: string;

    @Column({length: 256, name: 'biography', default: ""})
    biography: string;

    @Column({name: 'profile_picture_location', default: ""})
    profilePictureLocation: string;

    @Column({name: 'password_hash'})
    passwordHash: string;

    @OneToMany(() => VoxelBuildEntity, voxelBuild => voxelBuild.user)
    uploadedBuilds: VoxelBuildEntity[];

}