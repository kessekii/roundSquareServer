import { IsString, IsInt } from 'class-validator';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsInt()
  roundsPlayed: number;

  @IsInt()
  roundsWon: number;
}