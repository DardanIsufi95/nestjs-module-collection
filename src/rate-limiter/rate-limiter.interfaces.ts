export interface RateLimiterOptions {
	points: number; // Number of allowed requests
	duration: number; // Time window in seconds
}
