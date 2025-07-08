import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';

@Module({
  providers: [UsersService, UserRepository],
  controllers: [UsersController]
})
export class UsersModule {}
