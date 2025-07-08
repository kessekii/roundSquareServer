import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;
    @IsString()
  @MinLength(3)
  @MaxLength(32)
  password: string;
}