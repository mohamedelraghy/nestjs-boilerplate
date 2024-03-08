import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ example: 'super@admin.com' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'P@ssw0rd' })
  password: string;
}
