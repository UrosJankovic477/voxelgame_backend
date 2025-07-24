import { BadRequestException, Bind, Body, Controller, Delete, Get, Head, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Int32 } from "typeorm";
import { UserDto, UserDtoParsePipe } from "./user.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./user.decorator";
import { UserEntity } from "./user.entity";
import { ImageFileInterceptor, UploadService } from "src/upload/upload.service";
import { log } from "console";
import { Type } from "class-transformer";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private uploadService: UploadService
    ) {
        
    }

    @Get(':username')
    public getUser(@Param('username') username: string) {
        return this.userService.userGet(username);
    }

    @Post('sign-up')
    @UseInterceptors(ImageFileInterceptor)
    @Bind(UploadedFile())
    public createUser(@Body('user', UserDtoParsePipe) userDto: UserDto, @UploadedFile() file?: Express.Multer.File) {
        let profilePictureLocation: string | null = null;
        if (file) {
            this.uploadService.saveImageFile(file);
            profilePictureLocation = `uploads/images/${file.filename}`;
        }
        return this.userService.userCreate({
            ...userDto,
            profilePictureLocation
        });
    }
    
    @Delete(':username')
    @UseGuards(AuthGuard('jwt'))
    public deleteUser(@User() user, @Param('username') username: string) {
        if (username !== user.username) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        if (!!user.profilePictureLocation) {
            this.uploadService.delete(user.profilePictureLocation);
        }
        return this.userService.userDelete(username);
    }

    @Put()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(ImageFileInterceptor)
    public editUser(@User() user, @Body() userDto: UserDto, @UploadedFile() file?: Express.Multer.File) {
        if (file) {
            if (user.profilePictureLocation) {
                this.uploadService.delete(user.profilePictureLocation);
            }
            user.profilePictureLocation = `uploads/images/${file.filename}`;
            this.uploadService.saveImageFile(file);
        }
        
        return this.userService.userEdit(user.username, userDto);
    }

    @Get(':username/builds')
    public getUserBuilds(@Param('username') username: string, @Query('count') count?: number, @Query('page') page: number = 1) {
        if (page < 1) {
            throw new BadRequestException("Page doesn't exist");
        }
        return this.userService.userGetBuilds(username, count, page - 1); 
    }

    @Get()
    public getUsersLike(@Query() name: string) {
        return this.userService.userGetLike(name);
    }

    @Head(':username/subscribe')
    @UseGuards(AuthGuard('jwt'))
    public subcribeToUser(@Param('username') producerUsername: string, @User() user) {
        return this.userService.subscribeToUser(producerUsername, user.username);
    }

    @Delete(':username/subscribe')
    @UseGuards(AuthGuard('jwt'))
    public unsubcribeToUser(@Param('username') producerUsername: string, @User() user) {
        return this.userService.unsubscribeToUser(producerUsername, user.username);
    }

    @Get(':username/subscribe')
    @UseGuards(AuthGuard('jwt'))
    public isSubcribed(@Param('username') producerUsername: string, @User() user) {
        return this.userService.isSubscribed(producerUsername, user.username);
    }

    @Get('subscribers')
    @UseGuards(AuthGuard('jwt'))
    public getSubscriptions(@User() user) {
        return this.userService.getSubscriptions(user.username);
    }
}