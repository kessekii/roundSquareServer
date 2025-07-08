import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoundRepository } from './rounds.repository';
import { UserRepository } from '../users/users.repository';
import { Round, RoundStatus } from './rounds.entity';
import { DataSource, LessThan } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(RoundRepository)
    private readonly roundsRepo: RoundRepository,
    @InjectRepository(UserRepository)
    private readonly usersRepo: UserRepository,
    private readonly dataSource: DataSource,
    private readonly logger = new Logger(RoundsService.name),
  ) {}
// Automatically start rounds that have been in PLANNED state for more than 30 seconds
  @Cron(CronExpression.EVERY_10_SECONDS)
  async autoStartPlannedRounds() {
    const threshold = new Date(Date.now() - 30 * 1000); // 30 seconds ago
    const rounds = await this.roundsRepo.find({
      where: {
        status: RoundStatus.PLANNED,
        createdAt: LessThan(threshold),
      },
    });

    for (const round of rounds) {
      round.status = RoundStatus.IN_PROCESS;
      await this.roundsRepo.save(round);
      this.logger.log(`Round ${round.id} auto-started after 30 seconds`);
    }
  }
  async createRound(player1Id: string, player2Id: string): Promise<Round> {
    if (player1Id === player2Id) throw new BadRequestException('Cannot challenge yourself');
    const p1 = await this.usersRepo.findOne({ where: { id: player1Id } });
    const p2 = await this.usersRepo.findOne({ where: { id: player2Id } });
    if (!p1 || !p2) throw new NotFoundException('Player not found');

    const round = this.roundsRepo.create({
      player1: p1,
      player2: p2,
      status: RoundStatus.PLANNED,
    });
    return this.roundsRepo.save(round);
  }

  async startRound(id: string): Promise<Round> {
    const round = await this.roundsRepo.findOne({ where: { id }, relations: ['player1','player2'] });
    if (!round) throw new NotFoundException('Round not found');
    if (round.status !== RoundStatus.PLANNED) throw new BadRequestException('Round not in planned state');
    round.status = RoundStatus.IN_PROCESS;
    return this.roundsRepo.save(round);
  }

  async finishRound(id: string, score1: number, score2: number): Promise<Round> {
    return this.dataSource.transaction(async manager => {
      const repo = manager.getRepository(Round);
      const userRepo = manager.getRepository(User);
      const round = await repo.findOne({ where: { id }, relations: ['player1','player2'] });
      if (!round) throw new NotFoundException();
      if (round.status !== RoundStatus.IN_PROCESS) throw new BadRequestException();

      round.player1Score = score1;
      round.player2Score = score2;
      round.status = RoundStatus.FINISHED;
      round.winner = score1 > score2 ? round.player1 : round.player2;
      await repo.save(round);

      // update stats
      const p1 = round.player1, p2 = round.player2;
      p1.roundsPlayed++; p2.roundsPlayed++;
      if (round.winner.id === p1.id) p1.roundsWon++;
      else p2.roundsWon++;
      await userRepo.save([p1, p2]);

      return round;
    });
  }
  async getRoundStatsById(id: string): Promise<Round | null> {
    return this.dataSource.transaction(async manager => {
      const repo = manager.getRepository(Round);
      
       const round = await repo.findOne({ where: { id }, relations: ['player1','player2'] });

      return round;
    });
  
  }
  async getPlannedForUser(userId: string): Promise<Round[]> {
    return this.roundsRepo.findPlannedRoundsForUser(userId);
  }
  async addScoreToRound(addScore: { userId: string; roundId: string}): Promise<Round> {
     return this.dataSource.transaction(async manager => {
        const repo = manager.getRepository(Round);
    const round = await repo.findOne({ where: { id: addScore.roundId }, relations: ['player1', 'player2'] });
    if (!round) throw new NotFoundException('Round not found');
    if (round.status !== RoundStatus.IN_PROCESS) throw new BadRequestException('Round not in process');

    if (round.player1.id === addScore.userId) {
      round.player1Score++;
    } else if (round.player2.id === addScore.userId) {
      round.player2Score++;
    } else {
      throw new BadRequestException('User is not a participant of this round');
    }

    return repo.save(round);
  })
}
}
