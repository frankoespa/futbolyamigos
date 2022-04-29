import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TarjetaController } from "./controllers/TarjetaController";
import { TarjetaLogic } from "./providers/TarjetaLogic";
import { TarjetaRepository } from "./repository/TarjetaRepository";
import { Tarjeta, TarjetaSchema } from "./schema/TarjetaSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Tarjeta.name, schema: TarjetaSchema }])],
    providers: [TarjetaLogic, TarjetaRepository],
    controllers: [TarjetaController],
    exports: [TarjetaLogic]
})
export class TarjetaModule {}