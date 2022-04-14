import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EquipoController } from "./controllers/EquipoController";
import { EquipoLogic } from "./providers/EquipoLogic";
import { EquipoRepository } from "./repository/EquipoRepository";
import { Equipo, EquipoSchema } from "./schema/EquipoSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Equipo.name, schema: EquipoSchema }])],
    providers: [EquipoLogic, EquipoRepository],
    controllers: [EquipoController],
    exports: [EquipoLogic]
})
export class EquipoModule {}