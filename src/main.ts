import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { configure } from './config.main';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'debug', 'warn', 'verbose', 'log'],
  });
  const config = app.get(ConfigService);
  const port = process.env.PORT || config.port || 3000;
  configure(app, config);

  await app.listen(port, () => {
    Logger.verbose(
      `🚀 Server listening on PORT:${port} | ${config.nodeEnv} | ${config.apiUrl}/api`,
    );
  });
}

bootstrap();
