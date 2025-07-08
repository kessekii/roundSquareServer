import { IsString } from 'class-validator';

export class AddScoreDto {
  @IsString()
  userId: string;

  @IsString()
  roundId: string;
}
