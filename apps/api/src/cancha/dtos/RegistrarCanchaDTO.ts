import { RequiredString } from '../../global/base/validations/RequiredString';
import { Types } from "mongoose";
import { OptionalMongoId } from '../../global/base/validations/OptionalMongoId';
import { RequiredInt } from '../../global/base/validations/RequiredInt';

export class RegistrarCanchaDTO {

    @OptionalMongoId()
    _id?: Types.ObjectId

    @RequiredString()
    readonly Nombre: string;

    @RequiredInt()
    readonly Identificador: number;

}