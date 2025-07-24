import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class UserDto {
    username?: string;
    displayname?: string;
    password?: string;
    profilePictureLocation?: string | null;
    confirmPassword?: string;
    about?: string;
}

export class UserDtoParsePipe implements PipeTransform {

    transform(value: string, metadata: ArgumentMetadata) {
        return JSON.parse(value) as UserDto;
    }

}