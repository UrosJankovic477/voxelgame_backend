export class VoxelBuildDto {
    title: string;
    description: string;
    dataJson: string;
    previewPictureLocation: string | null;
    user?: {
        username: string;
        displayname: string;
    };
}