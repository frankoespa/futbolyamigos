import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TorneoCompuestoController } from "./controllers/TorneoCompuestoController";
import { TorneoCompuestoLogic } from "./providers/TorneoCompuestoLogic";
import { TorneoCompuestoRepository } from "./repository/TorneoCompuestoRepository";
import { TorneoCompuesto, TorneoCompuestoSchema } from "./schema/TorneoCompuestoSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: TorneoCompuesto.name, schema: TorneoCompuestoSchema }])],
    providers: [TorneoCompuestoLogic, TorneoCompuestoRepository],
    controllers: [TorneoCompuestoController],
    exports: [TorneoCompuestoLogic]
})
export class TorneoCompuestoModule {}