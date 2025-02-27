import { UserEntity } from "src/user/user.entity";
import { Entity, Int32, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VoxelBuildEntity {
    @PrimaryGeneratedColumn()
    id: Int32;

    @ManyToOne(() => UserEntity, user => user.uploadedBuilds)
    user: UserEntity;
}