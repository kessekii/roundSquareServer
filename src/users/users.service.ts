import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { createHash } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly usersRepo: UserRepository,
  ) {}

  private generateId(username: string): string {
    return createHash('sha256').update(username + Date.now()).digest('hex');
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    let user = await this.usersRepo.findByUsername(dto.username);
    if (user) throw new Error('Username already taken');

    user = this.usersRepo.create({
      id: this.generateId(dto.username),
      username: dto.username,
      roundsPlayed: 0,
      roundsWon: 0,
    });
    return this.usersRepo.save(user);
  }

  async getUser(username: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepo.find();
  }
}
