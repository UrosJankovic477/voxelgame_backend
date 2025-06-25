import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Int32 } from "typeorm";
import { UserDto } from "./user.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./user.decorator";
import { UserEntity } from "./user.entity";

@Controller('user')
export class UserController {
    constructor(private service: UserService) {
        
    }

    @Get(':username')
    public getUser(@Param('username') username: string) {
        return this.service.userGet(username);
    }

    @Post('signup')
    public createUser(@Body() user: UserDto) {
        return this.service.userCreate(user);
    }
    
    @Delete()
    @UseGuards(AuthGuard('jwt'))
    public deleteUser(@User() user) {
        return this.service.userDelete(user.username);
    }

    @Put()
    @UseGuards(AuthGuard('jwt'))
    public editUser(@User() user, @Body() userDto: UserDto) {
        return this.service.userEdit(user.username, userDto);
    }

    @Get(':username/builds')
    public getUserBuilds(@Param('username') username: string, @Query('count') count?: number, @Query('page') page: number = 1) {
        if (page < 1) {
            throw new BadRequestException("Page doesn't exist");
        }
        return this.service.userGetBuilds(username, count, page - 1); 
    }

    @Get()
    public getUsersLike(@Query() name: string) {
        return this.service.userGetLike(name);
    } 
}