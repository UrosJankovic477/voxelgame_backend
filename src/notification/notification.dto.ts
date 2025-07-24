import { UUID } from "crypto";

export interface NotificationDto {
   sourceUUID: UUID,
   subscribersUsernames: string[],
   notificationType: 'comment' | 'voxel-build'
}