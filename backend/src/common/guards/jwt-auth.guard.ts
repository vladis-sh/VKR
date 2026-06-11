import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ALLOW_UNVERIFIED_KEY } from '../decorators/allow-unverified.decorator';

export const IS_PUBLIC_KEY = 'isPublic';

// How long a user may use the app before confirming their email.
// Keep in sync with frontend/src/shared/lib/emailVerification.ts
export const EMAIL_VERIFY_GRACE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export const EMAIL_NOT_VERIFIED_CODE = 'EMAIL_NOT_VERIFIED';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const authenticated = await Promise.resolve(
      super.canActivate(context) as boolean | Promise<boolean>,
    );
    if (!authenticated) {
      return false;
    }

    const allowUnverified = this.reflector.getAllAndOverride<boolean>(ALLOW_UNVERIFIED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowUnverified) {
      return true;
    }

    // JwtStrategy.validate returns the full DB user, so emailVerified and
    // createdAt are available here without an extra query.
    const user = context.switchToHttp().getRequest().user;
    if (
      user &&
      user.emailVerified === false &&
      Date.now() - new Date(user.createdAt).getTime() > EMAIL_VERIFY_GRACE_MS
    ) {
      throw new ForbiddenException({
        message: 'Подтвердите email, чтобы продолжить пользоваться приложением',
        errorCode: EMAIL_NOT_VERIFIED_CODE,
      });
    }

    return true;
  }

  handleRequest(err: any, user: any, _info: any) {
    void _info;
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
