import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return {
      id: user.id,
      username: user.username,
      roundsPlayed: user.roundsPlayed,
      roundsWon: user.roundsWon,
    };
  }

  @Post('login/')
  async getUser(@Param('username') username: string): Promise<UserResponseDto> {
    const user = await this.usersService.getUser(username);
    return {
      id: user.id,
      username: user.username,
      roundsPlayed: user.roundsPlayed,
      roundsWon: user.roundsWon,
    };
  }

  @Get()
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.getUsers();
  return users
}
}