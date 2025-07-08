import { IsString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { RoundStatus } from '../rounds.entity';

export class PlayerRoundStatsDto {
  @IsInt()
  id: string;

  @IsEnum(RoundStatus)
  status: RoundStatus;

  @IsInt()
  score: number;

  @IsOptional()
  @IsString()
  winnerId?: string; // Winner will be set only when the round is finished

  
}
