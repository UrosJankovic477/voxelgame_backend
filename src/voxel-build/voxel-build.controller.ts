import { Controller } from "@nestjs/common";
import { VoxelBuildService } from "src/voxel-build/voxel-build.service";

@Controller('voxel-build')
export class VoxelBuildController {
    constructor(private service: VoxelBuildService) {
        
    }
    
}