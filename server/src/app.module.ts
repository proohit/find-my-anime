import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AnimeDbModule } from './animedb/animedb.module';
import { AppController } from './app.controller';
import { AnimeEnricherModule } from './enrichment/anime-enricher.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    StatsModule,
    AnimeEnricherModule,
    AnimeDbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DB_NAME') ?? 'find-my-anime',
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', '..', 'web', 'dist'),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
