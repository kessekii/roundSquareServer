import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoundRepository } from './rounds.repository';
import { UserRepository } from '../users/users.repository';
import { Round, RoundStatus } from './rounds.entity';
import { DataSource, LessThan } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlayerRoundStatsDto } from './dto/player-round-stats.dto';

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(RoundRepository)
    private readonly roundsRepo: RoundRepository,
    @InjectRepository(UserRepository)
    private readonly usersRepo: UserRepository,
    private readonly dataSource: DataSource,
  ) {}
// Automatically start rounds that have been in PLANNED state for more than 30 seconds
  @Cron(CronExpression.EVERY_SECOND)
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
      //this.logger.log(`Round ${round.id} auto-started after 30 seconds`);
    }
  }
  @Cron(CronExpression.EVERY_SECOND)
  async autoFinishOngoingRounds() {
    const threshold = new Date(Date.now() - (30 + 40) * 1000); // 30 seconds ago
    const rounds = await this.roundsRepo.find({
      where: {
        status: RoundStatus.IN_PROCESS,
        createdAt: LessThan(threshold),
      },
    });

    for (const round of rounds) {
      round.status = RoundStatus.FINISHED;
      round.winner = round.player1Score > round.player2Score ? round.player1 : round.player1Score === round.player2Score ? undefined : round.player2;
      
      await this.roundsRepo.save(round);
     // this.logger.log(`Round ${round.id} auto-finished after 70 seconds`);
    }
  }
  async createRound(player1Id: string, player2Id: string): Promise<Round> {
 

    const p1 = await this.usersRepo.findOne({ where: { id: player1Id } });
    const p2 = await this.usersRepo.findOne({ where: { id: player2Id } });
    if (!p1 || !p2) throw new NotFoundException('Игрок не найден');
    console.log(`Creating round between ${p1.username} and ${p2.username}`);
    if (p1.username !== 'admin') throw new BadRequestException('Только администратор может создавать матчи');
    
    if (player1Id === player2Id) throw new BadRequestException('Нельзя бросать вызов самому себе');
    const round = this.roundsRepo.create({
      player1: p1,
      player2: p2,
      status: RoundStatus.PLANNED,
    });
    return this.roundsRepo.save(round);
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
    if (!round) throw new NotFoundException('Раунд не найден');
    if (round.status === RoundStatus.PLANNED) throw new BadRequestException('Раунд не начат');
    if (round.status === RoundStatus.FINISHED) throw new BadRequestException(round.winner && round.winner.username ? `Раунд окончен, победитель: ${round.winner.username} - ${round.player1Score > round.player2Score ? round.player1Score : round.player2Score} очков` : 'Раунд окончен, победитель не определён');

    if (round.player1.id === addScore.userId && round.player1.username.toLowerCase() !== 'nikita') {
      round.player1Score++;
    } else if (round.player2.id === addScore.userId && round.player2.username.toLowerCase() !== 'nikita') {
      round.player2Score++;
    } else {
      throw new BadRequestException('Пользователь не является участником этого раунда');
    }
    return await repo.save(round);
   
  });
}
}
