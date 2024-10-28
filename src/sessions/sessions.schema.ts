import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ type: Date, required: true })
  accessTokenValidUntil: Date;

  @Prop({ type: Date, required: true })
  refreshTokenValidUntil: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
