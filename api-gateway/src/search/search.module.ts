import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchClientProvider } from "src/client/search-client.provider";

@Module({
	controllers: [SearchController],
	providers: [SearchClientProvider],
})
export class SearchModule {}
