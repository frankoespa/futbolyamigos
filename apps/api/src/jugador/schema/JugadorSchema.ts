import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Equipo } from '../../equipo/schema/EquipoSchema';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class Jugador extends Document {

    @Prop({ required: true })
    Nombres: string;

    @Prop({ required: true })
    Apellidos: string;

    @Prop({ default: null })
    FechaNacimiento?: Date;

    @Prop({ required: true })
    Dni: string;

    @Prop({ default: null })
    Email?: string;

    @Prop({ default: null })
    Telefono?: string;

    @Prop({ type: Types.ObjectId, ref: Equipo.name, autopopulate: true, default: null })
    Equipo?: Equipo;

}

export const JugadorSchema = SchemaFactory.createForClass(Jugador);