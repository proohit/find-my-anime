import { TelemetrySource } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'telemetry' })
export class TelemetryDataModel {
  @Prop()
  data: string;

  @Prop()
  source?: TelemetrySource;

  @Prop({ default: 0 })
  count: number;
}

export type TelemetryDataDocument = TelemetryDataModel & Document;

export const TelemetryDataSchema =
  SchemaFactory.createForClass(TelemetryDataModel);
