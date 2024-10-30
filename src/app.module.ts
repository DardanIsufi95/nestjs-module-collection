import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';

@Module({
	imports: [
		RateLimiterModule.register({
			points: 5,
			duration: 60,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
