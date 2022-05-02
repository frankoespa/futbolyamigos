import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SancionController } from "./controllers/SancionController";
import { SancionLogic } from "./providers/SancionLogic";
import { SancionRepository } from "./repository/SancionRepository";
import { Sancion, SancionSchema } from "./schema/SancionSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Sancion.name, schema: SancionSchema }])],
    providers: [SancionLogic, SancionRepository],
    controllers: [SancionController],
    exports: [SancionLogic]
})
export class SancionModule {}