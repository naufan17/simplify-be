/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email }, 
      select: ['id', 'email', 'isVerified', 'password'] 
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id: userId }, 
      select: ['name', 'email', 'phoneNumber', 'profileImage'] 
    });
  }

  async findPasswordById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id: userId }, 
      select: ['email', 'password'] 
    });
  }

  async save(
    name: string, 
    email: string,
    hashedPassword: string
  ): Promise<User> {
    const profileImage = 'https://res.cloudinary.com/ddpbwjjfz/image/upload/v1706756352/profile/dqfxsphjjtbfwt4v62gv.jpg';
    return this.userRepository.save({ name, email, profileImage, password: hashedPassword });
  }

  async updateProfile(
    id: string,
    name: string | undefined,
    email: string | undefined,
    phoneNumber: string | undefined,
  ): Promise<any> {
    return this.userRepository.update(id, { name, email, phoneNumber });
  }

  async updatePassword(
    id: string, 
    hashedPassword: string
  ): Promise<any> {
    return this.userRepository.update(id, { password: hashedPassword });
  }

  async updateIsVerified(
    id: string, 
    isVerified: boolean
  ): Promise<any> {
    return this.userRepository.update(id, { isVerified });
  }
}