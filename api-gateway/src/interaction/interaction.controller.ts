import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { CreateInteractionDto } from "./dto/create-interaction.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";
import { lastValueFrom } from "rxjs";

@Controller("interaction")
export class InteractionController {
	constructor() {}
	@Post("like")
	async handleLike(@Param(":contentId") contentId: number) {
		// return lastValueFrom()
	}
}
