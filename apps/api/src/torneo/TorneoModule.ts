import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TorneoController } from "./controllers/TorneoController";
import { TorneoLogic } from "./providers/TorneoLogic";
import { TorneoRepository } from "./repository/TorneoRepository";
import { Torneo, TorneoSchema } from "./schema/TorneoSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Torneo.name, schema: TorneoSchema }])],
    providers: [TorneoLogic, TorneoRepository],
    controllers: [TorneoController],
    exports: [TorneoLogic]
})
export class TorneoModule {}