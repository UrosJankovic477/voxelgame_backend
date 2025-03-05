import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoxelBuildEntity } from "./voxel-build.entity";
import { Repository } from "typeorm";

@Injectable()
export class VoxelBuildService {
    constructor(@InjectRepository(VoxelBuildEntity) private voxelBuildReposirory: Repository<VoxelBuildEntity>) {
        
    }

    
}