import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { IUser } from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /* Validate user credentials */
  async validateUser(data: LoginDto): Promise<IUser | null> {
    const { username, password } = data;

    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;

      return result;
    }
    return null;
  }

  /* Generate JWT token for a validated user */
  async loginUser(user: IUser) {
    const tokens = await this.generateTokens(user.id, user.username);
    await this.saveRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  /* Logout user */
  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshTokenHash: null });
  }

  /* Validate refresh token */
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user?.refreshTokenHash) {
      throw new ForbiddenException('Access denied');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.username);
    await this.saveRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  /* Creates access + refresh tokens in parallel */
  private async generateTokens(userId: number, username: string) {
    const payload = { id: userId, username };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return { access_token, refresh_token };
  }

  /* Stores hashed refresh token in database for security */
  private async saveRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshTokenHash: hash });
  }
}
