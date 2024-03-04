import { IsEnum, IsIn, IsNumber, IsPositive, IsString } from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsIn(Object.values(Environment))
  NODE_ENV = Environment.Development;

  @IsNumber()
  @IsPositive()
  PORT: number;

  @IsString()
  MONGO_URI: string;
}
