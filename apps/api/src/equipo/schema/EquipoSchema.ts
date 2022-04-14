import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Torneo } from '../../torneo/schema/TorneoSchema';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class Equipo extends Document {

    @Prop({ required: true })
    Nombre: string;

    @Prop({ type: Types.ObjectId, ref: Torneo.name, autopopulate: true, required: true })
    Torneo: Torneo;

}

export const EquipoSchema = SchemaFactory.createForClass(Equipo);