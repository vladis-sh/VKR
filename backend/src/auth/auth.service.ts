import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { RegisterProfileDto } from './dto/register-profile.dto';
import { isRussianEmail, RUSSIAN_EMAIL_MESSAGE } from './russian-email';
import { VerificationTokenType } from '@prisma/client';

const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mail: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return null;

    return user;
  }

  async register(dto: RegisterDto) {
    const user = await this.createUser(dto);
    return this.sanitizeUser(user);
  }

  async registerAndLogin(dto: RegisterDto) {
    const user = await this.createUser(dto);
    return this.login(user);
  }

  private async createUser(dto: RegisterDto) {
    // Defense in depth: the DTO validates this too, but createUser may be
    // reached from other entry points in the future.
    if (!isRussianEmail(dto.email)) {
      throw new BadRequestException(RUSSIAN_EMAIL_MESSAGE);
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        isProfileComplete: false,
      },
    });

    await this.sendEmailVerification(user);

    return user;
  }

  async updateProfile(userId: string, dto: RegisterProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
        isProfileComplete: true,
      },
    });

    return this.sanitizeUser(user);
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { sub: user.id, email: user.email };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn') || '15m',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: this.sanitizeUser(user),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  // ── Email verification & password reset ──────────────────────────────

  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private async issueToken(
    userId: string,
    type: VerificationTokenType,
    ttlMs: number,
  ): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + ttlMs);

    await this.prisma.verificationToken.create({
      data: { userId, tokenHash, type, expiresAt },
    });

    return rawToken;
  }

  /** Validates a single-use token, marks it used, and returns the record. */
  private async consumeToken(rawToken: string, type: VerificationTokenType) {
    const tokenHash = this.hashToken(rawToken);
    const record = await this.prisma.verificationToken.findUnique({
      where: { tokenHash },
    });

    if (
      !record ||
      record.type !== type ||
      record.usedAt !== null ||
      record.expiresAt < new Date()
    ) {
      throw new BadRequestException('Ссылка недействительна или устарела');
    }

    await this.prisma.verificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    return record;
  }

  /** Issues a token and sends the verification email. Never throws. */
  async sendEmailVerification(user: { id: string; email: string }) {
    let link: string;
    try {
      const rawToken = await this.issueToken(
        user.id,
        VerificationTokenType.email_verify,
        EMAIL_VERIFY_TTL_MS,
      );
      link = `${this.frontendUrl()}/verify-email?token=${rawToken}`;
    } catch (err) {
      this.logger.error(`Failed to issue verification token for ${user.email}`, err as Error);
      return;
    }

    // In dev, always surface the link in the logs so the flow is testable
    // even when outbound SMTP is blocked.
    if (this.isDev()) {
      this.logger.log(`[DEV] Email verification link for ${user.email}: ${link}`);
    }

    // Fire-and-forget: never block the HTTP response on the SMTP round-trip.
    void this.mail
      .sendEmailVerification(user.email, link)
      .catch((err) =>
        this.logger.error(`Failed to send verification email to ${user.email}`, err as Error),
      );
  }

  async verifyEmail(rawToken: string) {
    const record = await this.consumeToken(rawToken, VerificationTokenType.email_verify);
    const user = await this.prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    });
    return this.sanitizeUser(user);
  }

  async resendVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.emailVerified) {
      return { message: 'Email уже подтверждён' };
    }
    await this.sendEmailVerification(user);
    return { message: 'Письмо с подтверждением отправлено' };
  }

  async requestPasswordReset(email: string) {
    // Generic response — do not reveal whether the email exists.
    const genericResponse = {
      message:
        'Если аккаунт с таким email существует, мы отправили письмо со ссылкой для сброса пароля',
    };

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return genericResponse;
    }

    let link: string;
    try {
      const rawToken = await this.issueToken(
        user.id,
        VerificationTokenType.password_reset,
        PASSWORD_RESET_TTL_MS,
      );
      link = `${this.frontendUrl()}/reset-password?token=${rawToken}`;
    } catch (err) {
      this.logger.error(`Failed to issue password reset token for ${user.email}`, err as Error);
      return genericResponse;
    }

    if (this.isDev()) {
      this.logger.log(`[DEV] Password reset link for ${user.email}: ${link}`);
    }

    // Fire-and-forget: never block the HTTP response on the SMTP round-trip.
    void this.mail
      .sendPasswordReset(user.email, link)
      .catch((err) =>
        this.logger.error(`Failed to send password reset email to ${user.email}`, err as Error),
      );

    return genericResponse;
  }

  async resetPassword(rawToken: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const record = await this.consumeToken(rawToken, VerificationTokenType.password_reset);
    const passwordHash = await bcrypt.hash(password, 12);

    await this.prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    });

    // Invalidate any other outstanding reset tokens for this user.
    await this.prisma.verificationToken.deleteMany({
      where: {
        userId: record.userId,
        type: VerificationTokenType.password_reset,
        usedAt: null,
      },
    });

    return { message: 'Пароль успешно изменён' };
  }

  private frontendUrl(): string {
    return this.configService.get<string>('frontendUrl') || 'http://localhost:5173';
  }

  private isDev(): boolean {
    return (this.configService.get<string>('nodeEnv') || 'development') !== 'production';
  }

  sanitizeUser(user: any) {
    const sanitized = { ...user };
    delete sanitized.passwordHash;
    return sanitized;
  }
}
