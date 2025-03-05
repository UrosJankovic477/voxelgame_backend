import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Int32 } from "typeorm";
import { UserDto } from "./user.dto";

@Controller('user')
export class UserController {
    constructor(private service: UserService) {
        
    }

    @Get(':id')
    public getUser(@Param('id', ParseIntPipe) id: Int32) {
        return this.service.userGet(id);
    }

    @Post('signUp')
    public createUser(@Body() user: UserDto) {
        return this.service.userCreate(user);
    }
    
}