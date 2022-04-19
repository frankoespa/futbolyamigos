import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Cancha } from '../../cancha/schema/CanchaSchema';
import { Equipo } from '../../equipo/schema/EquipoSchema';
import { Torneo } from '../../torneo/schema/TorneoSchema';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class Partido extends Document {

    @Prop({ required: true })
    Fecha: Date;

    @Prop({ required: true, type: Torneo })
    Torneo: Torneo;

    @Prop({ type: Types.ObjectId, ref: Cancha.name, autopopulate: true, default: null })
    Cancha?: Cancha;

    @Prop({ required: true, type: Equipo })
    EquipoLocal: Equipo;

    @Prop({ required: true, type: Equipo })
    EquipoVisitante: Equipo;

}

export const PartidoSchema = SchemaFactory.createForClass(Partido);