import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoxelBuildEntity } from "./voxel-build.entity";
import { Int32, Repository } from "typeorm";
import { UUID } from "crypto";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildDto } from "./voxel-build.dto";

@Injectable()
export class VoxelBuildService {
    constructor(@InjectRepository(VoxelBuildEntity) private voxelBuildReposirory: Repository<VoxelBuildEntity>) {
        
    }

    public getBuild(uuid: UUID) {
        return this.voxelBuildReposirory.findOne({
            where: [
                {
                    uuid: uuid,
                },
            ]
        });
    }

    public getBuilds(count: number, offset: number) {
        return this.voxelBuildReposirory.find({
            relations: {
                user: true
            },
            take: count,
            skip: offset,
        });
    }

    public getBuildComments(uuid: UUID, count: number = 10, offset: number = 0) {
        return this.voxelBuildReposirory.find({
            relations: {
                comments: true,
            },
            take: count,
            skip: offset,
            where: [
                {
                    uuid: uuid,
                },
            ]
        });
    }

    public createBuild(voxelBuildDto: VoxelBuildDto, user: UserEntity) {
        const voxelBuild = this.voxelBuildReposirory.create({
            title: voxelBuildDto.title,
            user: user,
            description: voxelBuildDto.description,
        });
        return this.voxelBuildReposirory.save(voxelBuild).then(voxelBuildEntity => voxelBuildEntity.uuid);
    }

    public deleteBuild(uuid: UUID) {
        this.voxelBuildReposirory.delete(uuid);
    }
}