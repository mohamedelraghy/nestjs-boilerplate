import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { ConfigModuleConfig } from './config/options/config.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModuleConfig } from './config/options/database.config';

@Module({
  imports: [
    ConfigModule.forRootAsync(ConfigModule, { useClass: ConfigModuleConfig }),
    MongooseModule.forRootAsync({
      useClass: MongooseModuleConfig,
      imports: [ConfigModule.Deferred],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
