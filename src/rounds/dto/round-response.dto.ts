import { IsString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { RoundStatus } from '../rounds.entity';

export class RoundResponseDto {
  @IsInt()
  id: string;

  @IsString()
  player1Id: string;

  @IsString()
  player2Id: string;

  @IsEnum(RoundStatus)
  status: RoundStatus;

  @IsInt()
  player1Score: number;

  @IsInt()
  player2Score: number;

  @IsOptional()
  @IsString()
  winnerId?: string; // Winner will be set only when the round is finished

  
}
