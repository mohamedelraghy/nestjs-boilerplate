import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from './config/config.service';

export function initSwagger(
  app: INestApplication,
  config: ConfigService,
): void {
  const options = new DocumentBuilder()
    .setTitle('nest boilerplate')
    .setDescription('nest boilerplate API documentation')
    .setExternalDoc('Postman Collection', config.apiUrl + '-json')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
