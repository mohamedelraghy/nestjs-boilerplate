import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './interfaces/config-options.interface';
import { CONFIG_MODULE_OPTIONS } from './config.constants';

@Module({})
export class ConfigModule extends createConfigurableDynamicRootModule<
  ConfigModule,
  ConfigModuleOptions
>(CONFIG_MODULE_OPTIONS, {
  providers: [ConfigService],
  exports: [ConfigService],
}) {
  /**
   * To prevent calling externallyConfigured every time, we create a static property to use instead.
   */
  static Deferred = ConfigModule.externallyConfigured(ConfigModule, 0);
}
