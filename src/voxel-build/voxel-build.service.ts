import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoxelBuildEntity } from "./voxel-build.entity";
import { Int32, Like, Repository } from "typeorm";
import { UUID } from "crypto";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildDto } from "./voxel-build.dto";
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class VoxelBuildService {
    

    constructor(
        @InjectRepository(VoxelBuildEntity) private voxelBuildReposirory: Repository<VoxelBuildEntity>,
        private notificationService: NotificationService
    ) {
        
    }

    getBuildUserUsername(uuid: string) {
        return this.voxelBuildReposirory.query(`
            select "userUsername" from voxel_builds where post_uuid = $1; 
            `, [uuid]).then((value: {userUsername: string}[]) => value[0].userUsername)
    }

    public getUserBuilds(username: string, count: number, offset: number) {
        return this.voxelBuildReposirory
        .createQueryBuilder('vb')
        .where('vb."userUsername" = :username', {username})
        .take(count)
        .offset(offset)
        .getMany()
    }

    public getBuild(uuid: UUID) {
        return this.voxelBuildReposirory
        .createQueryBuilder('voxel_build')
        .leftJoin('voxel_build.user', 'user')
        .addSelect(['user.username', 'user.displayname'])
        .where('voxel_build.uuid = :uuid', {uuid: uuid})
        .getOne();
    }

    public getBuilds(count: number, offset: number, searchString?: string) {
        let query = this.voxelBuildReposirory
        .createQueryBuilder('voxel_build')
        .leftJoin('voxel_build.user', 'user')
        .addSelect(['user.username', 'user.displayname']);
        if (searchString) {
            const searchParam = { search: `%${searchString}%` }; 
            query = query.where('LOWER(voxel_build.title) LIKE LOWER(:search)', searchParam)
            .orWhere('LOWER(voxel_build.description) LIKE LOWER(:search)', searchParam)
            .orWhere('LOWER(user.displayname) LIKE LOWER(:search)', searchParam);
        }
        return query.orderBy('voxel_build.posted', 'DESC').take(count).skip(offset).getMany();
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

    public saveBuild(voxelBuildDto: VoxelBuildDto, username: string, notify: boolean = true) {
           
        const voxelBuild = this.voxelBuildReposirory.create({
            title: voxelBuildDto.title,
            user: {
                username
            },
            description: voxelBuildDto.description,
            previewPictureLocation: voxelBuildDto.previewPictureLocation,
            posted: new Date()
        });

        const buildSaveResult = this.voxelBuildReposirory.save(voxelBuild);

        if (notify) {
            const subscribers = this.voxelBuildReposirory.query(`
                select subscriber 
                from producer_subscriber
                where producer = $1;
                `, [username])
                .then((subscribers: {subscriber: string}[]) => subscribers.map(object => object.subscriber));
    
            return subscribers.then(subscribers => buildSaveResult.then(voxelBuildEntity => {
                    this.notificationService.postNotification({
                    sourceUuid: voxelBuildEntity.uuid,
                    subscribersUsernames: subscribers,
                    notificationType: "voxel-build"
                });
                return voxelBuildEntity.uuid;
            }));
        }
        else {
            return buildSaveResult.then(voxelBuildEntity => voxelBuildEntity.uuid);
        }
        
    }

    public deleteBuild(uuid: UUID) {
        this.voxelBuildReposirory.delete(uuid);
    }
}