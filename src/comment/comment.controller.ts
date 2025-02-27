import { Controller } from "@nestjs/common";
import { CommentService } from "src/comment/comment.service";

@Controller('comments')
export class CommentController {
    constructor(private service: CommentService) {
        
    }
    
}