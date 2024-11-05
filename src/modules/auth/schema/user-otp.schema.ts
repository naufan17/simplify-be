import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class UserOtp extends Document {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  otp!: number;

  @Prop({ required: true, defaultValue: new Date(), expires: 5 * 60 })
  createdAt!: Date;
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);