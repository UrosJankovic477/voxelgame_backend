import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';  
import * as argon from "argon2";
import { log } from 'console';
import * as passport from "passport";
import * as localStrategy from "passport-local";
import { UserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    public constructor(private userService: UserService, private jwtService: JwtService) {

    }

    public async verifyPassword(username: string, password: string) {
        return this.userService.userGetWithHash(username).then(user => {
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

    public async login(userDto: UserDto) { 
        return {
            access_token: await this.jwtService.signAsync({
                username: userDto.username,
                sub: userDto.username
            })
        }
    }
}
