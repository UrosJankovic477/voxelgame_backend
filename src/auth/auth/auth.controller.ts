import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    public constructor(private service: AuthService) {

    }

    @Post('login')
    public login(@Body() loginDto: LoginDto) {
        this.service.verifyPassword(loginDto.userName, loginDto.password).then(loginStatus => {
            
        });
    }
}
