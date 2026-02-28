import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'metadata' })
export class AnimeDbMetadataModel {
  @Prop()
  lastDownload?: string;

  @Prop()
  lastUpdate?: string;
}

export type AnimeDbMetadataDocument = AnimeDbMetadataModel & Document;

export const AnimeDbMetadataSchema =
  SchemaFactory.createForClass(AnimeDbMetadataModel);
