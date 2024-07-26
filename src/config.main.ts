import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import * as passport from 'passport';
import { join } from 'path';
import * as session from 'express-session';
import RedisStore, * as redisStore from 'connect-redis';
import { createClient } from 'redis';

import { ConfigService } from './config/config.service';
import { initSwagger } from './swagger';

export function configure(
  app: NestExpressApplication,
  config: ConfigService,
): void {
  // Create Redis client
  const redisClient = createClient({
    url: 'redis://localhost:6379',
  });

  redisClient.connect();

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  app.useStaticAssets(join(__dirname, '..', 'upload'));

  app.set('trust proxy', 1); // trust first proxy
  app.use(
    // Set security-related HTTP headers
    helmet(),
    // Compress response bodies for most requests
    compression(),
    // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
    cookieParser(),
    // Simple cookie-based session middleware
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'your-secret-key', // Replace with your secret key
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.isProd, // Only use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),

    passport.initialize(),

    passport.session(),

    // Basic rate-limiting middleware for Express
    rateLimit({
      windowMs: 10 * 60 * 1000, // 1 Hour
      max: config.rateLimit,
      message: 'Too many requests, please try again later.',
    }),

    // https://github.com/goldbergyoni/nodebestpractices/blob/49da9e5e41bd4617856a6ecd847da5b9c299852e/sections/production/assigntransactionid.md
    // (req: Request, res: Response, next: NextFunction) => {
    //   req.session.id = req?.session?.id ?? uuidv4();
    //   next();
    // },
  );

  // Registers pipes as global pipes (will be used within every HTTP route handler)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  // Registers a prefix for every HTTP route path.
  app.setGlobalPrefix(config.globalPrefix);

  // Initialize swagger documentation
  initSwagger(app, config);
}
