import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";


@Injectable()
export class UserService {
    constructor(private userRepository: Repository<UserEntity>) {
        
    }
    
    
}