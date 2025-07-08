import { IsString, IsInt, IsOptional } from 'class-validator';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsInt()
  @IsOptional()
  roundsPlayed?: number;

  @IsInt()
  @IsOptional()
  roundsWon?: number;
}