import { readFileSync } from 'fs';
import { join } from 'path';

import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'dotenv';

import { CONFIG_MODULE_OPTIONS } from './config.constants';
import { ConfigModuleOptions } from './interfaces/config-options.interface';
import { EnvironmentVariables } from './model/env.model';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ConfigService {
  private envConfig: EnvironmentVariables;

  constructor(@Inject(CONFIG_MODULE_OPTIONS) options: ConfigModuleOptions) {
    const { dir, fileName, useProcess } = options;

    if (!fileName && !useProcess) {
      throw new Error(
        'Missing configuration Options.' +
          ' If using process.env variables, please mark useProcess as "true".' +
          ' Otherwise, please provide an env file.',
      );
    }

    let config: { [key: string]: any };
    if (!useProcess && fileName) {
      // * get working directory
      process.env.PWD = process.env.PWD ? process.env.PWD : process.cwd();
      config = parse(
        readFileSync(join(process.env.PWD, dir, options.fileName)),
      );
    } else {
      config = process.env;
    }

    this.envConfig = this.validateConfig(config);
  }

  private validateConfig(config: Record<string, any>): EnvironmentVariables {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get isProd(): boolean {
    const env = this.nodeEnv.toLowerCase();
    return env === 'production';
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  get mongoUri(): string {
    return this.envConfig.MONGO_URI;
  }

  get rateLimit(): number {
    return this.envConfig.RATE_LIMIT;
  }

  get globalPrefix(): string {
    return this.envConfig.GLOBAL_PREFIX;
  }

  get apiUrl(): string {
    return this.envConfig.API_URL;
  }
}
