import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, Optional, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RATE_LIMITER_OPTIONS, RATE_LIMITER_SKIP, RATE_LIMITER_METADATA } from './rate-limiter.constants';
import { RateLimiterOptions } from './rate-limiter.interfaces';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
	private requestsMap = new Map<string, { count: number; timestamp: number }>();

	constructor(
		@Optional()
		@Inject(RATE_LIMITER_OPTIONS)
		private readonly options: RateLimiterOptions = { points: 10, duration: 60 },
		private readonly reflector: Reflector,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const skipRateLimit = this.reflector.get<boolean>(RATE_LIMITER_SKIP, context.getHandler());

		if (skipRateLimit) {
			return next.handle();
		}

		const rateLimitOptions = this.reflector.get<RateLimiterOptions>(RATE_LIMITER_METADATA, context.getHandler()) || this.options;

		const req = context.switchToHttp().getRequest();
		const key = req.ip;

		const currentTime = Date.now();

		let record = this.requestsMap.get(key);

		if (record) {
			// Check if the duration has passed
			if (currentTime - record.timestamp < rateLimitOptions.duration * 1000) {
				// Within duration
				if (record.count >= rateLimitOptions.points) {
					throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
				} else {
					record.count += 1;
				}
			} else {
				// Duration has passed, reset
				record = { count: 1, timestamp: currentTime };
			}
		} else {
			// New record
			record = { count: 1, timestamp: currentTime };
		}

		this.requestsMap.set(key, record);

		return next.handle();
	}
}
