import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email!: string;

  @Exclude()
  @Prop({ required: true })
  password!: string;

  @Prop()
  lastLogin: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Schema Methods
  updateLastLogin: () => Promise<void>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Schema Methods
UserSchema.methods.updateLastLogin = async function () {
  const self = this as UserDocument;

  self.lastLogin = new Date();
  return self.save();
};
