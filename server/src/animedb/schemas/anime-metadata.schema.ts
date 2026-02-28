import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TelemetryEntry } from '@find-my-anime/shared/interfaces/AnimeDb';

@Schema({ collection: 'metadata' })
export class AnimeDbMetadataModel {
  @Prop()
  lastDownload?: string;

  @Prop()
  lastUpdate?: string;

  @Prop({ type: [{ data: String, count: Number, source: String }] })
  telemetry: TelemetryEntry[];
}

export type AnimeDbMetadataDocument = AnimeDbMetadataModel & Document;

export const AnimeDbMetadataSchema =
  SchemaFactory.createForClass(AnimeDbMetadataModel);
