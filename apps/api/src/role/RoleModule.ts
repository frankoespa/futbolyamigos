import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/RoleSchema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
})
export class RoleModule {}