import { Body, Controller, Post } from "@nestjs/common";
import path from "path";
import { UserService } from "src/user/user.service";
import { LoginDto } from "../auth/auth/login.dto";

@Controller('user')
export class UserController {
    constructor(private service: UserService) {
        
    }
    
}