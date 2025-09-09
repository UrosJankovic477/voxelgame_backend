import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { Repository } from 'typeorm';
import { UploadService } from 'src/upload/upload.service';
import { SubscriptionController } from './subscriptions.controller';
import { UploadModule } from 'src/upload/upload.module';
import { VoxelBuildModule } from 'src/voxel-build/voxel-build.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UploadModule,
    VoxelBuildModule
  ],
  providers: [UserService],
  controllers: [UserController, SubscriptionController],
  exports: [UserService]
})
export class UserModule {}
