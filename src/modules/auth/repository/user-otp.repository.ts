import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserOtp } from "../schema/user-otp.schema";

@Injectable()
export class UserOtpRepository {
  constructor(@InjectModel(UserOtp.name) private readonly userOtpModel: Model<UserOtp>) {}

  async findByOtp(otp: number): Promise<UserOtp | null> {
    return await this.userOtpModel.findOne({ otp });
  }

  async findByEmail(email: string): Promise<UserOtp | null> {
    return await this.userOtpModel.findOne({ email });
  }
  
  async save(userId: string, email: string, otp: number, createdAt: Date): Promise<UserOtp> {
    return await this.userOtpModel.create({ userId, email, otp, createdAt });
  }
}