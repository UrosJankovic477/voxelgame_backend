import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.modulel';
import { VoxelBuildEntity } from './voxel-build/voxel-build.entity';
import { VoxelBuildModule } from './voxel-build/voxel-build.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, UserModule, VoxelBuildModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
