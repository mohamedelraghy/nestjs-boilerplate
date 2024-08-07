import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { ConfigModuleConfig } from './config/options/config.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModuleConfig } from './config/options/database.config';
import { UploadsModule } from './uploads/uploads.module';
import { CoreModule } from './core/core.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheModuleOptions } from './config/options/cache.config';

@Module({
  imports: [
    ConfigModule.forRootAsync(ConfigModule, { useClass: ConfigModuleConfig }),
    MongooseModule.forRootAsync({
      useClass: MongooseModuleConfig,
      imports: [ConfigModule.Deferred],
    }),
    CoreModule,
    AuthModule,
    UsersModule,
    UploadsModule,
    CacheModule.registerAsync({ useClass: CacheModuleOptions }),
  ],
})
export class AppModule {}
