import { IsString, MinLength } from 'class-validator';
import * as crypto from 'crypto';

export class LoginDto {
    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    get encodedPassword(): string {
        return crypto.createHash('sha256').update(this.password).digest('hex');
    }
}