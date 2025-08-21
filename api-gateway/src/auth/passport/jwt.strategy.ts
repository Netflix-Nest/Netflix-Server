import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { lastValueFrom } from "rxjs";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		config: ConfigService,
		@Inject("AUTH_SERVICE") private readonly authClient: ClientProxy
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>("JWT_ACCESS_TOKEN_SECRET")!,
		});
	}

	async validate(payload: any) {
		const { sub, email, role, fullName } = payload;
		const permissions = await lastValueFrom(
			this.authClient.send("findOneRole", role)
		);
		return {
			userId: sub,
			email: email,
			role: role,
			permissions,
			fullName: fullName,
		};
	}
}
