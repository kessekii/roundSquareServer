import { IsInt } from 'class-validator';

export class StartRoundDto {
  @IsInt()
  roundId: string;
}
