import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./comment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity])],
    exports: [TypeOrmModule]
})
export class CommentModule {
    
}