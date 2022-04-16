import { RequiredString } from '../../global/base/validations/RequiredString';
import { Types } from "mongoose";
import { OptionalMongoId } from '../../global/base/validations/OptionalMongoId';

export class RegistrarEquipoDTO {

    @OptionalMongoId()
    readonly _id?: Types.ObjectId

    @RequiredString()
    readonly Nombre: string;

    @OptionalMongoId()
    readonly TorneoID?: Types.ObjectId

}