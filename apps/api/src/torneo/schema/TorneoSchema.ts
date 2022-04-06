import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class Torneo extends Document {

    @Prop({ required: true })
    Nombre: string;

    @Prop({ required: true })
    FechaInicio: Date;

    @Prop({ default: null })
    FechaFin: Date;

    @Prop({ default: false })
    Finalizado: boolean;

}

export const TorneoSchema = SchemaFactory.createForClass(Torneo);