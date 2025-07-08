import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { createHash } from 'crypto';
import { RoundRepository } from 'src/rounds/rounds.repository';
import { Or } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { generateSHA256 } from 'src/helpers/sha256';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly usersRepo: UserRepository,
    @InjectRepository(RoundRepository)
    private readonly roundsRepo: RoundRepository,
  ) {}

  private generateId(username: string): string {
    return createHash('sha256').update(username + Date.now()).digest('hex');
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    let user = await this.usersRepo.findByUsername(dto.username);
    if (user) throw new Error('Логин уже занят');

    user = this.usersRepo.create({
      id: this.generateId(dto.username),
      username: dto.username,
      password: generateSHA256(dto.password),
    });
    return this.usersRepo.save(user);
  }

  async getUser(loginDto: LoginDto): Promise<UserResponseDto | null> {
    const user = await this.usersRepo.findOne({ where: { username: loginDto.username, password: loginDto.password } });
    if (!user) throw new NotFoundException('Логин или пароль неверны');
    if (user.password) {
    const roundsWon = await this.roundsRepo.count({ where: { winner: user } });
    const roundsPlayed = await this.roundsRepo.count({ where: [{ player1: user }, { player2: user }] });
    
    return {
        id: user.id,
        username: user.username,
        roundsPlayed: roundsPlayed,
        roundsWon: roundsWon,
    };
  }
  return null
  }
  async getUsers(): Promise<UserResponseDto[]> {
    return (await this.usersRepo.find()).map(user => ({
      id: user.id,
      username: user.username,
    }));
  }
}
