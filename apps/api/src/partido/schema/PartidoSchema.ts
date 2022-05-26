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

    @Prop({ type: Types.ObjectId, ref: Torneo.name, autopopulate: true, required: true })
    Torneo: Torneo;

    @Prop({ type: Types.ObjectId, ref: Cancha.name, autopopulate: true, default: null })
    Cancha?: Cancha;

    @Prop({ type: Types.ObjectId, ref: Equipo.name, autopopulate: true, required: true })
    EquipoLocal: Equipo;

    @Prop({ type: Types.ObjectId, ref: Equipo.name, autopopulate: true, required: true })
    EquipoVisitante: Equipo;

    @Prop({ default: null, min: 0 })
    ResultadoLocal?: number;

    @Prop({ default: null, min: 0 })
    ResultadoVisitante?: number;

    @Prop({ required: true, min: 1 })
    NroFecha: number;

}

export const PartidoSchema = SchemaFactory.createForClass(Partido);