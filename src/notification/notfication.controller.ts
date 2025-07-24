import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { AuthGuard } from "@nestjs/passport";
import { UUID } from "crypto";
import { User } from "src/user/user.decorator";
import { NotificationDto } from "./notification.dto";

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {

    }

    @Post()
    postNotification(@Body() notification: NotificationDto) {
        return this.notificationService.postNotification(notification);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getNotifications(@User() user) {
        return this.notificationService.getNotifications(user.username);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    deleteNotification(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.deleteNotification(id);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    deleteAllNotifications(@User() user) {
        return this.notificationService.deleteAllNotifications(user);
    }

}