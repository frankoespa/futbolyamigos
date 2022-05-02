import { Types } from "mongoose";
import { OptionalMongoId } from '../../global/base/validations/OptionalMongoId';
import { RequiredMongoId } from '../../global/base/validations/RequiredMongoId';
import { RequiredInt } from '../../global/base/validations/RequiredInt';

export class RegistrarSancionDTO {

    @OptionalMongoId()
    _id?: Types.ObjectId

    @RequiredMongoId()
    readonly JugadorID: Types.ObjectId;

    @RequiredInt()
    readonly TarjetaID: number;

}