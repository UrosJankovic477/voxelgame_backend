import { Request, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    public constructor(private service: AuthService) {

    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    public login(@Request() req: any) {
        this.service.login(req.user)
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    public getProfile(@Request() req: any) {
        return req.user;
    }
}
