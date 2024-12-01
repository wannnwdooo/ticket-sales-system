import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { AddRoleDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async create(user: DeepPartial<User>): Promise<User> {
    return await this.userRepository.save(this.userRepository.create(user));
  }

  public async update(user: DeepPartial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async findOneById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role'],
      relations: { bookings: true, transactions: true },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'role'],
    });
  }

  public async setRole({ role }: AddRoleDto, userId: string): Promise<User> {
    const user = await this.findOneById(userId);
    return this.update({ ...user, role });
  }
}
