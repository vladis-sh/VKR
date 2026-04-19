import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterProfileDto, RegisterLevelDto } from './dto/register-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 15 * 60 * 1000,
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user (step 1)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.registerAndLogin(dto);

    res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    return { user };
  }

  @Post('register/profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete profile step 2 - set name and avatar' })
  @ApiBearerAuth('access_token')
  async registerProfile(@CurrentUser() user: any, @Body() dto: RegisterProfileDto) {
    const updated = await this.authService.updateProfile(user.id, dto);
    return { user: updated };
  }

  @Post('register/level')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete profile step 3 - set knowledge level' })
  @ApiBearerAuth('access_token')
  async registerLevel(@CurrentUser() user: any, @Body() dto: RegisterLevelDto) {
    const updated = await this.authService.setKnowledgeLevel(user.id, dto);
    return { user: updated };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, sets httpOnly cookies' })
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(req.user);

    res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout - clears auth cookies' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh cookie' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await this.authService.refreshTokens(refreshToken);

    res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return { user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiBearerAuth('access_token')
  async getMe(@CurrentUser() user: any) {
    const userData = await this.authService.getMe(user.id);
    return { user: userData };
  }
}
