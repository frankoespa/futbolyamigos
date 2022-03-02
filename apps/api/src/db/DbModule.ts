import { Module } from "@nestjs/common";
import { InitialDataService } from "./providers/InitialDataService";

@Module({
    providers: [InitialDataService]
})
export class DbModule {}