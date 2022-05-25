import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/common/dto/status.enum';

export type SkillDocument = Skill & Document;

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  // Record Status
  @Prop({ required: false, default: Status.ACTIVE })
  status: Status;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
