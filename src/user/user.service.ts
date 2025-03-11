import { BadRequestException, Get, Injectable } from "@nestjs/common";
import { DeepPartial, Int32, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserDto } from "./user.dto";
import * as argon from 'argon2'
import { error } from "console";
import { InjectRepository } from "@nestjs/typeorm";
import { title } from "process";


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
                about: user.about,
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

    public userGetWithHash(username: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: [
                {
                    username: username
                }
            ]
        })
    }
    
    public userGet(username: string): Promise<UserEntity | null> {    
        return this.userRepository.findOne({
            select: {
                username: true,
                displayname: true,
                about: true,
                profilePictureLocation: true,
            },
            where: [
                {
                    username: username
                }
            ]
        })
    }

    
    public userDelete(username: string) {
        return this.userRepository.delete(username);
    }

    public userEdit(username: string, userDto: UserDto) {
        return this.userRepository.update(username, {
            displayname: userDto.displayname,
            about: userDto.about
        })
    }

    public userGetBuilds(username: string, count: number = 10, page: number = 0) {
        return this.userRepository.find({
            relations: {
                uploadedBuilds: true,
            },
            select: {
                username: true,
                uploadedBuilds: true,
            },
            where: [
                {
                    username: username,
                },
            ],
            take: count,
            skip: page * count
        });
    }
    
}