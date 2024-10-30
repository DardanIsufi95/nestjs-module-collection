// rate-limiter.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { RATE_LIMITER_OPTIONS } from './rate-limiter.constants';
import { RateLimiterOptions } from './rate-limiter.interfaces';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';

@Module({})
export class RateLimiterModule {
	static register(options: RateLimiterOptions): DynamicModule {
		return {
			module: RateLimiterModule,
			providers: [
				{
					provide: RATE_LIMITER_OPTIONS,
					useValue: options,
				},
				{
					provide: APP_INTERCEPTOR,
					useClass: RateLimiterInterceptor,
				},
			],
			exports: [RATE_LIMITER_OPTIONS],
		};
	}
}
