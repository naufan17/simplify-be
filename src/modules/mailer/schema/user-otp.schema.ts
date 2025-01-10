import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Schema({ timestamps: true })
export class UserOtp extends Document {
  
  @Prop({ type: UUID, required: true, unique: true })
  userId!: string;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: Number, required: true })
  otp!: number;

  @Prop({ type: Date, required: true, defaultValue: new Date(), expires: 5 * 60 })
  createdAt!: Date;
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);