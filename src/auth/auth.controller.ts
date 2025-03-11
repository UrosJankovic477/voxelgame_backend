import { Request, Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {

    public constructor(private service: AuthService) {

    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    public login(@Body() userDto: UserDto) {
        return this.service.login(userDto)
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    public getProfile(@Request() req) {
        return req.user;
    }
}
