import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GolController } from "./controllers/GolController";
import { GolLogic } from "./providers/GolLogic";
import { GolRepository } from "./repository/GolRepository";
import { Gol, GolSchema } from "./schema/GolSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Gol.name, schema: GolSchema }])],
    providers: [GolLogic, GolRepository],
    controllers: [GolController],
    exports: [GolLogic]
})
export class GolModule {}