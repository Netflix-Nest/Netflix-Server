import { Controller, Get } from "@nestjs/common";
import { Public } from "@netflix-clone/common";

@Controller()
export class AppController {
	constructor() {}
	@Public()
	@Get("health")
	health() {
		return "Service working 123!!!";
	}
}
