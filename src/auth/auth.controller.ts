import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDto })
  @Post('login')
  async signIn(@Req() req) {
    this.addJwtToCookie(req);
    return { token: req.session.jwt };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('logout')
  logOut(@Req() req) {
    req.session = null;
    return;
  }

  private addJwtToCookie(req: Request) {
    try {
      req.session.jwt = this.authService.generateJwtToken(
        req.user,
      ).access_token;
    } catch (err) {
      throw new InternalServerErrorException(
        err,
        'Problem with cookie-session middleware?',
      );
    }
  }
}
