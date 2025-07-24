import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IntegerType, Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";
import { UUID } from "crypto";
import { off } from "process";
import { repl } from "@nestjs/core";

@Injectable()
export class CommentService {
    constructor(@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>) {
        
    }

    public async getCommentReplies(uuid: UUID, count: number = 10, offset: number = 0) {
        const replies = this.commentRepository.createQueryBuilder('comment')
        .addSelect('comment.uuid', 'uuid')
        .addSelect('comment.content', 'content')
        .addSelect('comment.posted', 'posted')
        .addSelect('comment.edited', 'edited')
        .addSelect('comment."parentUUID"', 'parentUUID')
        .leftJoin('comment.user', 'user')
        .addSelect('user.username', 'username')
        .addSelect('user.displayname', 'displayname')
        .addSelect('user.profile_picture_location', 'profilePictureLocation')
        .leftJoin('comment.voxelBuild', 'voxel_build')
        .addSelect('voxel_build."userUsername"', 'op')
        .where('"comment"."parentUUID" = :parentUUID', {
            parentUUID: uuid
        })
        .skip(offset).take(count);
        return {
            replies: await replies.getRawMany(),
            count: await replies.getCount()
        };
    } 

    public async getComments(uuid: UUID, count: number = 10, offset: number = 0) {
        const comments = this.commentRepository
        .createQueryBuilder('comment')
        .addSelect('comment.uuid', 'uuid')
        .addSelect('comment.content', 'content')
        .addSelect('comment.posted', 'posted')
        .addSelect('comment.edited', 'edited')
        .leftJoin('comment.user', 'user')
        .addSelect('user.username', 'username')
        .addSelect('user.displayname', 'displayname')
        .addSelect('user.profile_picture_location', 'profilePictureLocation')
        .leftJoin('comment.voxelBuild', 'voxel_build')
        .addSelect('voxel_build."userUsername"', 'op')
        .where('"comment"."voxelBuildUuid" = :postUuid', {
            postUuid: uuid
        })
        .skip(offset).take(count);
        return {
            comments: await comments.getRawMany(),
            count: await comments.getCount()
        };
    }

    public async postReply(content: string, username: string, parentUUID: UUID) {
        const reply = this.commentRepository.create({
            content,
            edited: null,
            posted: new Date(),
            user: {
                username
            },
            voxelBuild: null,
            parent: {
                uuid: parentUUID
            }
        });
        return this.commentRepository.save(reply);
    }

    public createComment(content: string, username: string, postUuid: UUID) {
        const comment = this.commentRepository.create({
            content: content,
            edited: null,
            posted: new Date(),
            user: {
                username
            },
            voxelBuild: {
                uuid: postUuid
            }
        });
        return this.commentRepository.save(comment);
    }

    public async editComment(uuid: UUID, content: string, username: string) {
        const result = await this.commentRepository.exists({
            where: [
                {
                    uuid: uuid,
                    user: {
                        username: username
                    },
                },
            ],
        });
        if (result) {
            return this.commentRepository.update(uuid, {
                content: content
            });
        }
        else {
            throw new UnauthorizedException();
        }
    }

    public async deleteComment(uuid: UUID, username: string) {
        const result = await this.commentRepository.exists({
            where: [
                {
                    uuid: uuid,
                    user: {
                        username: username
                    },
                },
            ],
        });
        if (result) {
            return this.commentRepository.softDelete(uuid);
        }
        else {
            throw new UnauthorizedException();
        }
    }
}