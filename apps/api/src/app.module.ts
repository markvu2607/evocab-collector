import config from '@/configs/app.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { ModelDefinition } from '@nestjs/mongoose';
import type { Schema as MongooseSchema } from 'mongoose';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { WordSchema } from '@/schemas/word.schema';
import { SavedSchema } from '@/schemas/saved.schema';

const wordModelDef: ModelDefinition = {
  name: 'words',
  schema: WordSchema as unknown as MongooseSchema,
};

const savedModelDef: ModelDefinition = {
  name: 'saveds',
  schema: SavedSchema as unknown as MongooseSchema,
};

const mongooseModels: ModelDefinition[] = [wordModelDef, savedModelDef];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.url'),
      }),
    }),
    MongooseModule.forFeature(mongooseModels),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
