import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    return this.userRepo.save({
      ...createUserInput,
      password: await bcryptjs.hash(createUserInput.password, 3),
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    await this.userRepo.update(id, { ...updateUserInput });
    return this.userRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<number> {
    await this.userRepo.remove(await this.userRepo.findOneBy({ id }));
    return id;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepo.findOne({
      where: { email },
    });
  }
}
