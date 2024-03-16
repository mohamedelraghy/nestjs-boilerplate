import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { UploadsController } from './uploads.controller';
import { MulterModuleConfig } from 'src/config/options/multer.config';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  imports: [MulterModule.registerAsync({ useClass: MulterModuleConfig })],
  providers: [UploadsService],
})
export class UploadsModule {}
