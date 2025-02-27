import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './login.dto'
import { JwtService } from '@nestjs/jwt';  
import { IsNull, Repository } from 'typeorm';
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

    public async verifyPassword(userName: string, password: string): Promise<string> {
        return this.userRepository.findOne({
            select: 
            {
                userName: true,
                passwordHash: true
            },
            where: [
                {
                    userName: userName
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
                return this.jwtService.signAsync(
                    {
                        id: user.id,
                        userName: user.userName, 
                    }
                );
            });
        });
    }
}
