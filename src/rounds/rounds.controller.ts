import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { StartRoundDto } from './dto/start-round.dto';
import { FinishRoundDto } from './dto/finish-round.dto';
import { RoundResponseDto } from './dto/round-response.dto';
import { Round } from './rounds.entity';
import { AddScoreDto } from './dto/add-score.dto';

@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post('create')
  async createRound(@Body() createRoundDto: CreateRoundDto): Promise<RoundResponseDto> {
    const round = await this.roundsService.createRound(createRoundDto.player1Id, createRoundDto.player2Id);
    return {
      id: round.id,
      player1Id: round.player1.id,
      player2Id: round.player2.id,
      status: round.status,
      player1Score: round.player1Score,
      player2Score: round.player2Score,
    };
  }

  @Post('start')
  async startRound(@Body() startRoundDto: StartRoundDto): Promise<RoundResponseDto> {
    const round = await this.roundsService.startRound(startRoundDto.roundId);
    return {
      id: round.id,
      player1Id: round.player1.id,
      player2Id: round.player2.id,
      status: round.status,
      player1Score: round.player1Score,
      player2Score: round.player2Score,
    };
  }

  @Post('finish')
  async finishRound(@Body() finishRoundDto: FinishRoundDto): Promise<RoundResponseDto> {
    const round = await this.roundsService.finishRound(
      finishRoundDto.roundId,
      finishRoundDto.player1Score,
      finishRoundDto.player2Score,
    );
    return {
      id: round.id,
      player1Id: round.player1.id,
      player2Id: round.player2.id,
      status: round.status,
      player1Score: round.player1Score,
      player2Score: round.player2Score,
      winnerId: round.winner?.id,
      
    };
  }
  @Get('stats/:roundId')
  async getRoundStats(@Param('roundId') roundId: string): Promise<Round | null> {
    const round = await this.roundsService.getRoundStatsById(roundId);
    if (!round) {
        return null
    }
    return round
  }
  @Post('score/') 
  async addScore(@Body() addScore: AddScoreDto): Promise<RoundResponseDto> {
    const round = await this.roundsService.addScoreToRound(addScore);
    return {
      id: round.id,
      player1Id: round.player1.id,
      player2Id: round.player2.id,              
        status: round.status,
        player1Score: round.player1Score,
        player2Score: round.player2Score,
        winnerId: round.winner?.id,
    };
  }
  @Post('planned/')
  async getPlannedRoundsForUser(@Param('userId') userId: string): Promise<RoundResponseDto[]> {
    const rounds = await this.roundsService.getPlannedForUser(userId);
    return rounds.map(round => ({
      id: round.id,
      player1Id: round.player1.id,
      player2Id: round.player2.id,
      status: round.status,
      player1Score: round.player1Score,
      player2Score: round.player2Score,
      winnerId: round.winner?.id,
    }));
  }
}
