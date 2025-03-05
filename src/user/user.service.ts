import { BadRequestException, Get, Injectable } from "@nestjs/common";
import { DeepPartial, Int32, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserDto } from "./user.dto";
import * as argon from 'argon2'
import { error } from "console";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
        
    }

    public userCreate(user: UserDto) {
        if (user.password == "") {
            throw new BadRequestException("Password is required.");
        }
        if (user.password.length < 8) {
            throw new BadRequestException("Password should be at least 8 characters long.");
        }
        if (user.password !== user.confirmPassword) {
            throw new BadRequestException("Password and confirm password don't match.");
        }
        argon.hash(user.password).then(hash => {
            const userEntitylike: DeepPartial<UserEntity> = {
                username: user.username,
                displayname: user.displayname,
                biography: user.biography,
                passwordHash: hash,
                profilePictureLocation: ""
            }; 
            const userEntity = this.userRepository.create(userEntitylike);
            return this.userRepository.save(userEntity);
        }).catch(reason => {
            console.error(reason);
            console.log(this.userRepository);
        });
    }
    
    public userGet(id: Int32): Promise<UserEntity | null> {    
        return this.userRepository.findOne({
            where: [
                {
                    id: id
                }
            ]
        })
    }

    public userGetBuilds(id: Int32, count?: number) {
        
    }
    
}