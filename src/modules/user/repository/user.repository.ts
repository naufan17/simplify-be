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
      select: ['name', 'phoneNumber', 'email'] 
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
    phoneNumber: string | undefined, 
    hashedPassword: string
  ): Promise<User> {
    return this.userRepository.save({ name, email, phoneNumber, password: hashedPassword });
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