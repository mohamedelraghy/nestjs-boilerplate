import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

@Injectable()
export class CacheModuleOptions implements CacheOptionsFactory {
  createCacheOptions():
    | Promise<CacheOptions<Record<string, any>>>
    | CacheOptions<Record<string, any>> {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: async () =>
        await redisStore({
          // Store-specific configuration:
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }),
    };
  }
}
