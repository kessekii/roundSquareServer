import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return {
      id: user.id,
      username: user.username,
      roundsPlayed: 0,
      roundsWon: 0,
    };
  }

  @Post('login/')
  async getUser(@Body() loginDto: LoginDto): Promise<UserResponseDto | null> {
    const user = await this.usersService.getUser(loginDto);
    return user ? {
      id: user.id,
      username: user.username,
      roundsPlayed: user.roundsPlayed,
      roundsWon: user.roundsWon,
    } : null;
  }

  @Get()
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.getUsers();
  return users
}
}