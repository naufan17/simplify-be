import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entitiy/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email }, select: [ 'id', 'name', 'email', 'password' ] });
  }

  async findById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: userId }, select: ['name', 'email' ] });
  }

  async save(name: string, email: string, hashedPassword: string): Promise<User> {
    return await this.userRepository.save({ name, email, password: hashedPassword });
  }
}