import { Bind, Body, Controller, Delete, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import multer, { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs"
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export const uploadDir = path.join(__dirname, '../../../', "uploads"); 

export const imageStorage = diskStorage({
    destination: path.join(uploadDir, 'images'),
});

export const postStorage = diskStorage({
    destination: path.join(uploadDir, 'posts'),
    filename(req, file, callback) {

        const filename = file.originalname + '.json';
        const uploadPath = path.join(uploadDir, 'posts', filename);
        if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }
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

    @Delete(':path')
    @UseInterceptors()
    delete(@Param() filepath: string) {
        const fullpath = path.join(uploadDir, filepath);
        fs.unlink(fullpath, (error) => {
            if (error) {
                console.error(error);
                
            }
            else {
                console.log(fullpath + " deleted");
                
            }
        })
    }

}

