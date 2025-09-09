import { Bind, HttpException, HttpStatus, Injectable, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { UUID } from "crypto";
import { FileTypeResult, fromBuffer } from "file-type";
import * as fs from "fs";
import { diskStorage, memoryStorage } from "multer";
import * as path from "path";
import { v4 as uuidV4 } from "uuid"

export const uploadDir = path.join(__dirname, '../../../', "uploads");
export const uploadDirImages =  path.join(uploadDir, 'images');
export const uploadDirPosts = path.join(uploadDir, 'posts');


export const ImageFileInterceptor = FileInterceptor('image', {
    async fileFilter(request, file, callback) {
        if ((await fromBuffer(file.buffer))?.mime.startsWith('image/')) {
            callback(null, true);
        }
        else {
            callback(new Error('Invalid file type'), false);
        }
    }
})

export const PostFileInterceptor = FileFieldsInterceptor([
    {
        name: 'preview',
        maxCount: 1,
    },
    {
        name: 'post',
        maxCount: 1,
    },
]);

export class IncorrectFileTypeException extends HttpException {
    constructor (fileType?: FileTypeResult) {
        super(`Incorrect file format ${fileType?.mime}`, HttpStatus.BAD_REQUEST);
    }
}

@Injectable()
export class UploadService {


    delete(filepath: string) {
        fs.unlink(filepath, (error) => {
            if (error) {
                console.error(error);
                
            }
            else {
                console.log(filepath + " deleted");
                
            }
        })
    }

    savePostFile(file: Express.Multer.File, uuid: UUID) {
        try {
            JSON.parse(file.buffer.toString());
        } catch (error) {
            throw new HttpException('Invalid JSON', HttpStatus.BAD_REQUEST);
        }
        const filename = uuid + '.json';
        const uploadPath = path.join(uploadDirPosts, filename);
        if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }
        fs.promises.writeFile(path.join(uploadDirPosts, filename), file.buffer);
        return 'uploads/posts/' + filename;
    }
    
    async saveImageFile(file: Express.Multer.File) {
        const fileType = await fromBuffer(file.buffer);
        if (!fileType || !fileType.mime.startsWith('image/')) {
            throw new IncorrectFileTypeException(fileType);
        }
        const filename = uuidV4();
        const uploadPath = path.join(uploadDirImages, filename);
        fs.promises.writeFile(uploadPath, file.buffer);
        return 'uploads/images/' + filename;
    }
} 

