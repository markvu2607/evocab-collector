import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SavedDocument = HydratedDocument<Saved>;

@Schema({ collection: 'saveds' })
export class Saved {
  @Prop({ type: Number, unique: true, index: true })
  id?: number;
}

export const SavedSchema = SchemaFactory.createForClass(Saved);
