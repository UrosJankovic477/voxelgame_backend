import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IntegerType, Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { UserEntity } from "src/user/user.entity";
import { VoxelBuildEntity } from "src/voxel-build/voxel-build.entity";

@Injectable()
export class CommentService {
    constructor(@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>) {
        
    }

    public getCommentReplies(id: number, count: number = 10, offset: number = 0) {
        this.commentRepository.find({
            relations: {
                user: true,
                voxelBuild: true,
                replies: {
                    user: true
                }, 
            }
        });
    } 

    public createComment(content: string, user: UserEntity, voxelBuild: VoxelBuildEntity) {
        const comment = this.commentRepository.create({
            content: content,
            user: user,
            voxelBuild: voxelBuild
        });
        return this.commentRepository.save(comment);
    }

    public async editComment(id: number, content: string, username: string) {
        const result = await this.commentRepository.exists({
            where: [
                {
                    id: id,
                    user: {
                        username: username
                    },
                },
            ],
        });
        if (result) {
            return this.commentRepository.update(id, {
                content: content
            });
        }
        else {
            throw new UnauthorizedException();
        }
    }

    public async deleteComment(id: number, username: string) {
        const result = await this.commentRepository.exists({
            where: [
                {
                    id: id,
                    user: {
                        username: username
                    },
                },
            ],
        });
        if (result) {
            return this.commentRepository.delete(id);
        }
        else {
            throw new UnauthorizedException();
        }
    }
}