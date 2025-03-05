import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';  
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import * as argon from "argon2";
import * as passport from "passport";
import * as localStrategy from "passport-local";

export enum LoginStatus {
    Succes,
    WrongPassword,
    WrongUserName,
}

@Injectable()
export class AuthService {

    public constructor(private userRepository: Repository<UserEntity>, private jwtService: JwtService) {

    }

    public async verifyPassword(userName: string, password: string) {
        return this.userRepository.findOne({
            where: [
                {
                    username: userName
                }
            ]
        }).then(user => {
            if (user == null) {
                throw new UnauthorizedException("Invalid user name.");
            }
            return argon.verify(user.passwordHash, password).then(result => {
                if (!result) {
                    throw new UnauthorizedException("Invalid password"); 
                }
                const { passwordHash, ...userNoPassword } = user;
                return userNoPassword;
            });
        });
    }

    public login(user: any) {
        return {
            access_token: this.jwtService.signAsync({
                userName: user.userName,
                sub: user.id
            })
        }
    }
}
