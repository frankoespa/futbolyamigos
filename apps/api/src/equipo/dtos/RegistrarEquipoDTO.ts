import { RequiredString } from '../../global/base/validations/RequiredString';
import { Types } from "mongoose";
import { OptionalMongoId } from '../../global/base/validations/OptionalMongoId';
import { RequiredMongoId } from '../../global/base/validations/RequiredMongoId';

export class RegistrarEquipoDTO {

    @OptionalMongoId()
    readonly _id?: Types.ObjectId

    @RequiredString()
    readonly Nombre: string;

    @RequiredMongoId()
    readonly TorneoID: Types.ObjectId

}