import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Partido } from '../../partido/schema/PartidoSchema';
import { Torneo } from '../../torneo/schema/TorneoSchema';
import { Jugador } from '../../jugador/schema/JugadorSchema';
import { Equipo } from '../../equipo/schema/EquipoSchema';
import { Tarjeta } from '../../tarjeta/schema/TarjetaSchema';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class Sancion extends Document {

    @Prop({ type: Types.ObjectId, ref: Partido.name, autopopulate: true, required: true })
    Partido: Partido;

    @Prop({ type: Types.ObjectId, ref: Torneo.name, autopopulate: true, required: true })
    Torneo: Torneo;

    @Prop({ type: Types.ObjectId, ref: Equipo.name, autopopulate: true, required: true })
    Equipo: Equipo;

    @Prop({ type: Types.ObjectId, ref: Jugador.name, autopopulate: true, required: true })
    Jugador: Jugador;

    @Prop({ type: Types.ObjectId, ref: Tarjeta.name, autopopulate: true, required: true })
    Tarjeta: Tarjeta;

    @Prop({ default: null })
    TotalFechas?: number;

}

export const SancionSchema = SchemaFactory.createForClass(Sancion);