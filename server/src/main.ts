import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Find My Anime API')
    .setDescription('Search API for Anime and Mapper to Anime Services')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('port') || process.env.port;
  Logger.log(`Server running on port ${port}`);
  await app.listen(port);
}
bootstrap();
