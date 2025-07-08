import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { RoundRepository } from 'src/rounds/rounds.repository';

@Module({
  providers: [UsersService, UserRepository, RoundRepository],
  controllers: [UsersController]
})
export class UsersModule {}
