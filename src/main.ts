import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = process.env.PORT || config.port || 3000;
  await app.listen(port, () => {
    Logger.verbose(`🚀 Server listening on prot:${port} at ${config.nodeEnv}`);
  });
}

bootstrap();
