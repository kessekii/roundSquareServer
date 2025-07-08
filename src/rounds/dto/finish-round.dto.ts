import { IsInt } from 'class-validator';

export class FinishRoundDto {
  @IsInt()
  roundId: string;

  @IsInt()
  player1Score: number;

  @IsInt()
  player2Score: number;
}
