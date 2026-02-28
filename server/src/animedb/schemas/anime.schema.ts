import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Season } from '@find-my-anime/shared/constants/Season';
import { Status } from '@find-my-anime/shared/constants/Status';
import { Type } from '@find-my-anime/shared/constants/Type';
import type { AnimeSeason } from '@find-my-anime/shared/interfaces/AnimeDb';

@Schema({ collection: 'anime' })
export class AnimeModel {
  @Prop({ type: [String], index: true })
  sources: string[];

  @Prop({ index: true })
  title: string;

  @Prop({ type: String })
  type: Type;

  @Prop()
  episodes: number;

  @Prop({ type: String })
  status: Status;

  @Prop({
    type: {
      season: { type: String, enum: Object.values(Season) },
      year: Number,
    },
  })
  animeSeason: AnimeSeason;

  @Prop()
  picture: string;

  @Prop()
  thumbnail: string;

  @Prop({ type: [String] })
  synonyms: string[];

  @Prop({ type: [String] })
  relatedAnime: string[];

  @Prop({ type: [String], index: true })
  tags: string[];

  @Prop()
  description?: string;

  @Prop({ type: String })
  provider?: Provider;
}

export type AnimeDocument = AnimeModel & Document;

export const AnimeSchema = SchemaFactory.createForClass(AnimeModel);
AnimeSchema.index({ title: 'text', synonyms: 'text' });
