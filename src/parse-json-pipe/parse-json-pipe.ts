import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class ParseJsonPipe implements PipeTransform {

    transform(value: string, metadata: ArgumentMetadata) {
        try {
            return JSON.parse(value);
        } catch (error) {
            console.error(error);
        }
    }
    
}