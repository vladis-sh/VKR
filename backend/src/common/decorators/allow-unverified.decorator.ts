import { SetMetadata } from '@nestjs/common';

export const ALLOW_UNVERIFIED_KEY = 'allowUnverifiedEmail';

/**
 * Lets an authenticated user whose email-verification grace period has
 * expired still reach the endpoint. Use only for endpoints the user needs
 * to get out of the locked state: fetching their own session and
 * resending the verification email.
 */
export const AllowUnverified = () => SetMetadata(ALLOW_UNVERIFIED_KEY, true);
