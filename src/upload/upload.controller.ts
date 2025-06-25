import { Bind, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import multer, { diskStorage } from "multer";
import * as path from "path";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

const uploadDir = path.join(__dirname, '../../../', "uploads"); 

const imageStorage = diskStorage({
    destination: path.join(uploadDir, 'images'),
});

const postStorage = diskStorage({
    destination: path.join(uploadDir, 'posts'),
    filename(req, file, callback) {
        callback(null, file.originalname + '.json');
    },
});

@Controller('upload')
export class UploadController {

    @Post('/image')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {
        storage: imageStorage,
        fileFilter(request, file, cb) {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type'), false);
            }
        }
    }))
    @Bind(UploadedFile())
    uploadImage(
        @UploadedFile() file: Express.Multer.File
    ) {
        return `uploads/images/${file.filename}`;
    }

    @Post('/post')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {
        storage: postStorage,
        fileFilter(request, file, cb) {
            if (file.mimetype.startsWith('application/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type'), false);
            }
        }
    }))
    @Bind(UploadedFile())
    uploadPost(
        @UploadedFile() file: Express.Multer.File
    ) {
        return `uploads/posts/${file.filename}`;
    }
}

