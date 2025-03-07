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
        return this.voxelBuildReposirory.find({
            where: [
                {
                    uuid: uuid,
                },
            ]
        });
    }

    public createBuild(voxelBuildDto: VoxelBuildDto, user: UserEntity) {
        this.voxelBuildReposirory.create({
            title: voxelBuildDto.title,
            fileLocation: voxelBuildDto.fileLocation,
            user: user
        });
    }
}