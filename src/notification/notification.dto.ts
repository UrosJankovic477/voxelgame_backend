import { UUID } from "crypto";

export interface NotificationDto {
   sourceUuid: UUID,
   subscribersUsernames: string[],
   notificationType: 'comment' | 'voxel-build'
}