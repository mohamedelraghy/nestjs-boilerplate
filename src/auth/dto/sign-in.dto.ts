import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ example: 'john' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'changeme' })
  password: string;
}
