import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/common/dto/status.enum';
import { SkillCategory, SkillCategoryDocument } from './skill-category.entity';

export type SkillDocument = Skill & Document;

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: SkillCategory.name, required: false })
  category?: SkillCategoryDocument;

  // Record Status
  @Prop({ required: false, default: Status.ACTIVE })
  status: Status;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
