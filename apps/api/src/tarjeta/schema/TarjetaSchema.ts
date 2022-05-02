import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    minimize: false,
    timestamps: false,
    versionKey: false
})
export class Tarjeta extends Document {

    @Prop()
    _id: number;

    @Prop({ required: true })
    Description: string;
}

export const TarjetaSchema = SchemaFactory.createForClass(Tarjeta);