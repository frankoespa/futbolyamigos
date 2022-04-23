import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PartidoController } from "./controllers/PartidoController";
import { PartidoLogic } from "./providers/PartidoLogic";
import { PartidoRepository } from "./repository/PartidoRepository";
import { Partido, PartidoSchema } from "./schema/PartidoSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Partido.name, schema: PartidoSchema }])],
    providers: [PartidoLogic, PartidoRepository],
    controllers: [PartidoController],
    exports: [PartidoLogic]
})
export class PartidoModule {}