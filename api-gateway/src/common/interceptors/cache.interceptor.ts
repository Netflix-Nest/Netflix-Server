import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Observable, from } from "rxjs";
import { tap, switchMap } from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		if (request.method !== "GET") {
			return next.handle();
		}
		const key = `route:${request.method}:${request.originalUrl || ""}`;

		return from(this.cacheManager.get(key)).pipe(
			switchMap((cachedResponse) => {
				if (cachedResponse) {
					console.log("Cache hit: ", cachedResponse);
					console.log("this is key of cache: ", key);
					return from(Promise.resolve(cachedResponse));
				}

				return next.handle().pipe(
					tap((response) => {
						this.cacheManager.set(key, response, 60 * 1000);
					})
				);
			})
		);
	}
}
