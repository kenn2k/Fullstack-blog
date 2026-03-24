import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from './types';

/* Create a new user */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user.' })
  @ApiResponse({
    status: 201,
    description: 'The user have successfully registered.',
  })
  @ApiConflictResponse({ description: 'This username already exists.' })
  register(@Body() data: RegisterDto) {
    return this.userService.registerUser(data);
  }

  /* Get profile */
  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get profile.' })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    description: 'Information about current user',
  })
  @ApiConflictResponse({ description: 'User not found' })
  profile(@Request() req: RequestWithUser) {
    return this.userService.getUsersProfile(req.user.id);
  }
}
