import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { NotificationEntity } from "./notification.entity";
import { NotificationDto } from "./notification.dto";
import { UserEntity } from "src/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(NotificationEntity) private notificationRepository: Repository<NotificationEntity>) {

    }

    postNotification(notificationDto: NotificationDto) {
        const posted = new Date();
        let uuidPart;

        if (notificationDto.notificationType == 'comment') {
            uuidPart = {
                comment: {
                    uuid: notificationDto.sourceUuid
                }
            };
        }
        else {
            uuidPart = {
                voxelBuild: {
                    uuid: notificationDto.sourceUuid
                }
            };
        }

        const notifications = notificationDto.subscribersUsernames.map<DeepPartial<NotificationEntity>>(username => ({
            user: {
                username
            },
            posted,
            ...uuidPart
        }));
        return this.notificationRepository.insert(notifications);
    }

    async getNotifications(username: string) {
        const notifications = await this.notificationRepository
        .createQueryBuilder('notification')
        .addSelect('notification.id', 'id')
        .addSelect('notification.posted', 'posted')
        .addSelect('notification.read', 'read')
        .addSelect('notification.voxel_build_uuid', 'voxelBuildUuid')
        .addSelect('notification.comment_uuid', 'commentUuid')
        .where('notification."username" = :username', { username })
        .leftJoin('comments', 'comment', 'notification."comment_uuid" = "comment".post_uuid')
        .addSelect('comment."userUsername"', 'commentUsername')
        .addSelect('comment."parentUuid"', 'commentParentUuid')
        .addSelect('comment."voxelBuildUuid"', 'commentPostUuid')
        .addSelect('comment.content', 'commentContent')
        .leftJoin('voxel_builds', 'vb', 'notification."voxel_build_uuid" = vb.post_uuid')
        .addSelect('vb."userUsername"', 'voxelBuildUsername')
        .addSelect('vb.title', 'voxelBuildTitle')
        .leftJoin('users', 'u', 'vb."userUsername" = u.username or comment."userUsername" = u.username')
        .addSelect('u.username', 'posterUsername')
        .addSelect('u.displayname', 'posterDisplayname')
        .addSelect('u.profile_picture_location', 'profilePictureLocation')
        .getRawMany();
        const unreadCount = await this.notificationRepository.countBy({
            read: false,
            user: {
                username
            }
        });
        return [notifications, unreadCount];
    }

    async deleteNotification(id: number) {
        const notification = await this.notificationRepository.findOneBy({
            id: id
        });
        if (notification == null) {
            throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }
        return this.notificationRepository.remove(notification);
    }

    async deleteAllNotifications(user: UserEntity) {
        const notifications = await this.notificationRepository.find({
            where: {
                user: {
                    username: user.username
                }
            }
        });
        if (notifications == null) {
            throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }
        return this.notificationRepository.remove(notifications);
    }


}