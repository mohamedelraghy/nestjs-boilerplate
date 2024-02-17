import { IsEnum, IsIn, IsNumber, IsPositive } from 'class-validator';

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
}
