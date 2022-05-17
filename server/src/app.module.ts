import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnimeDbModule } from './animedb/animedb.module';
import { AppController } from './app.controller';
import { AnimeEnricherModule } from './enrichment/anime-enricher.module';

@Module({
  imports: [
    AnimeEnricherModule,
    AnimeDbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev'],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
