import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req } from "@nestjs/common";
import { UUID } from "crypto";
import { VoxelBuildService } from "src/voxel-build/voxel-build.service";
import { VoxelBuildDto } from "./voxel-build.dto";
import { UserEntity } from "src/user/user.entity";

@Controller('voxel-build')
export class VoxelBuildController {
    constructor(private service: VoxelBuildService) {
        
    }
    
    @Get(':uuid')
    public getBuild(@Param('uuid', ParseUUIDPipe) uuid: UUID) {
        this.service.getBuild(uuid);
    }

    @Post()
    public createBuild(@Body() voxelBuildDto: VoxelBuildDto, @Req() req: Request) {
        req.
        this.service.createBuild(voxelBuildDto, user);
    }
}