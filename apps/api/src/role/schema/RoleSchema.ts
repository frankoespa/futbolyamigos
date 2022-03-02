import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    minimize: false,
    versionKey: false

})
export class Role extends Document {
    @Prop()
    _id: number;

    @Prop({ required: true })
    Description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);