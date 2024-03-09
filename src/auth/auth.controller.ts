import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
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
  async signIn(@Req() req, @Res({ passthrough: true }) res) {
    this.addJwtToCookie(req, res);
    return { token: req.session.jwt };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('logout')
  logOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    req.session = null;
    res.clearCookie('jwt');
  }

  private addJwtToCookie(req: Request, res: Response) {
    try {
      const token = this.authService.generateJwtToken(req.user).access_token;
      req.session.jwt = token;
      res.cookie('jwt', token, { httpOnly: true });
    } catch (err) {
      throw new InternalServerErrorException(
        err,
        'Problem with cookie-session middleware?',
      );
    }
  }
}
