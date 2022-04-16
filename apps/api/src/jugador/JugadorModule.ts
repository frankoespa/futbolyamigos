import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JugadorController } from "./controllers/JugadorController";
import { JugadorLogic } from "./providers/JugadorLogic";
import { JugadorRepository } from "./repository/JugadorRepository";
import { Jugador, JugadorSchema } from "./schema/JugadorSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Jugador.name, schema: JugadorSchema }])],
    providers: [JugadorLogic, JugadorRepository],
    controllers: [JugadorController],
    exports: [JugadorLogic]
})
export class JugadorModule {}