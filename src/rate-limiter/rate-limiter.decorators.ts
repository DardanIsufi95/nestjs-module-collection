import { SetMetadata } from '@nestjs/common';
import { RateLimiterOptions } from './rate-limiter.interfaces';
import { RATE_LIMITER_METADATA } from './rate-limiter.constants';
import { RATE_LIMITER_SKIP } from './rate-limiter.constants';

export const RateLimit = (options: RateLimiterOptions) => SetMetadata(RATE_LIMITER_METADATA, options);
export const SkipRateLimit = () => SetMetadata(RATE_LIMITER_SKIP, true);
