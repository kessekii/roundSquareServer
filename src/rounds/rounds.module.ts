import { Module } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { RoundsController } from './rounds.controller';
import { RoundRepository } from './rounds.repository';
import { UserRepository } from 'src/users/users.repository';

@Module({
  providers: [RoundsService, RoundRepository, UserRepository],
  controllers: [RoundsController]
})
export class RoundsModule {}
