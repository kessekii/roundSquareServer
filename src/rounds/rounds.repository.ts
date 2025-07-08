import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Round, RoundStatus } from './rounds.entity';
import { User } from '../users/users.entity';

@Injectable()
export class RoundRepository extends Repository<Round> {
  constructor(dataSource: DataSource) {
    super(Round, dataSource.createEntityManager());
  }

  async findPlannedRoundsForUser(userId: string): Promise<Round[]> {
    return this.find({
      where: [
        { player1: { id: userId }, status: RoundStatus.PLANNED },
        { player2: { id: userId }, status: RoundStatus.PLANNED }
      ],
      relations: ['player1', 'player2']
    });
  }
}
