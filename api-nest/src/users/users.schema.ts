import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: {
      locations: [String],
      units: String,
      notifications: Boolean,
    },
    default: {
      locations: [],
      units: 'celsius',
      notifications: false,
    },
  })
  preferences: {
    locations: string[];
    units: 'celsius' | 'fahrenheit';
    notifications: boolean;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
