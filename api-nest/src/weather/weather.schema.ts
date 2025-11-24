import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDocument = Weather & Document;

@Schema({ timestamps: true })
export class Weather {
  @Prop()
  timestamp: string;

  @Prop()
  temperature: number;

  @Prop()
  humidity?: number;

  @Prop()
  pressure?: number;

  @Prop()
  windspeed: number;

  @Prop()
  winddirection: number;

  @Prop()
  description?: string;

  @Prop()
  city: string;

  @Prop()
  rainProbability?: number;

  @Prop()
  weatherCode?: number;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
