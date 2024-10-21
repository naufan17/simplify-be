import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async save(name: string, email: string, hashedPassword: string): Promise<User> {
    const user = this.userRepository.create({ name, email, password: hashedPassword });
    return await this.userRepository.save(user);
  }
}