import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class Cancha extends Document {

    @Prop({ required: true })
    Nombre: string;

    @Prop({ required: true })
    Identificador: number;


}

export const CanchaSchema = SchemaFactory.createForClass(Cancha);