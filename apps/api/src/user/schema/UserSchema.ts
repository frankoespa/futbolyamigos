import { Document, Schema as MongooseSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../role/schema/RoleSchema';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class User extends Document {

    @Prop({ required: true })
    Email: string;

    @Prop({ required: true })
    Password: string;

    @Prop({ type: MongooseSchema.Types.Number, ref: Role.name, autopopulate: true })
    Role: Role;

    @Prop({ default: null })
    Nombre: string;

    @Prop({ default: null })
    Apellidos: string;

    // @Prop({ required: true })
    // Dni: number;


    // @Prop({ default: null })
    // Telefono?: string;  

    // @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Vehicle.name, autopopulate: true }])
    // Vehiculos?: Vehicle[];
}

export const UserSchema = SchemaFactory.createForClass(User);