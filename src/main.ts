import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import cookieSession = require('cookie-session');

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.use(
    cookieSession({
      name: 'session',
      keys: ['secret'],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'none',
      secure: false,
    }),
  );

  const port = process.env.PORT || config.port || 3000;
  await app.listen(port, () => {
    Logger.verbose(`🚀 Server listening on PORT:${port} at ${config.nodeEnv}`);
  });
}

bootstrap();
