import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from './config/config.service';

export function initSwagger(
  app: INestApplication,
  config: ConfigService,
): void {
  const options = new DocumentBuilder()
    .setTitle('nest boilerplate')
    .setDescription(
      '## 1. Getting started\n### 1.1 Download [Postman Collection](' +
        config.apiUrl +
        'api-json)\n',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
