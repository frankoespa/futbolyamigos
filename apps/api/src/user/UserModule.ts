import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./controllers/UserController";
import { UserLogic } from "./providers/UserLogic";
import { UserRepository } from "./repository/UserRepository";
import { User, UserSchema } from "./schema/UserSchema";

// @Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [UserLogic, UserRepository],
    controllers: [UserController],
    exports: [UserLogic]
})
export class UserModule {}