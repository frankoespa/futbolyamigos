import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CanchaController } from "./controllers/CanchaController";
import { CanchaLogic } from "./providers/CanchaLogic";
import { CanchaRepository } from "./repository/CanchaRepository";
import { Cancha, CanchaSchema } from "./schema/CanchaSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Cancha.name, schema: CanchaSchema }])],
    providers: [CanchaLogic, CanchaRepository],
    controllers: [CanchaController],
    exports: [CanchaLogic]
})
export class CanchaModule {}