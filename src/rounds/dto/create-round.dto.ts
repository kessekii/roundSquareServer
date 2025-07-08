import { IsString } from 'class-validator';

export class CreateRoundDto {
  @IsString()
  player1Id: string;

  @IsString()
  player2Id: string;
}
