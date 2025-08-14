import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WordDocument = HydratedDocument<Word>;

@Schema({ collection: 'words' })
export class Word {
  @Prop({ type: Number, unique: true, index: true })
  id?: number;

  @Prop()
  content?: string;

  @Prop()
  position?: string;

  @Prop()
  trans?: string;

  @Prop()
  en_sentence?: string;

  @Prop()
  vi_sentence?: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
