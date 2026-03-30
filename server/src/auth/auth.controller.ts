import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from './types';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { IUserWithRefresh } from 'src/user/types';
import { STRATEGY } from './constants';

interface RequestWithUser extends ExpressRequest {
  user: IUser;
}

interface RequestWithRefresh extends ExpressRequest {
  user: IUserWithRefresh;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* Login user */
  @UseGuards(AuthGuard(STRATEGY.LOCAL))
  @Post('login')
  @ApiOperation({ summary: 'Login user and receiving JWT token.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description:
      'The user has successfully logged in, receiving a JWT token and username.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  loginUser(@Request() req: RequestWithUser) {
    return this.authService.loginUser(req.user);
  }

  /* Validates refresh token using JWT Refresh Strategy */
  @UseGuards(AuthGuard(STRATEGY.JWT_REFRESH))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req: RequestWithRefresh) {
    const { id, refreshToken } = req.user;
    return this.authService.refreshTokens(id, refreshToken);
  }
}
