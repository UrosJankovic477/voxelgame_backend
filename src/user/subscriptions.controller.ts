import { UploadService } from "src/upload/upload.service";
import { UserService } from "./user.service";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./user.decorator";

@Controller('subscriptions')
export class SubscriptionController {
    constructor(
        private userService: UserService,
    ) {
        
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    public getSubscriptions(@User() user) {
        return this.userService.getSubscriptions(user.username);
    }
}