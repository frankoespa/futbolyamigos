import { OptionalDate } from '../../global/base/validations/OptionalDate';
import { RequiredBoolean } from '../../global/base/validations/RequiredBoolean';
import { RequiredDate } from '../../global/base/validations/RequiredDate';
import { RequiredString } from '../../global/base/validations/RequiredString';
import { Types } from "mongoose";
import { OptionalMongoId } from '../../global/base/validations/OptionalMongoId';

export class RegistrarTorneoDTO {

    @OptionalMongoId()
    _id?: Types.ObjectId

    @RequiredString()
    readonly Nombre: string;

    @RequiredDate()
    readonly FechaInicio: string;

    @OptionalDate()
    readonly FechaFin?: string;

    @RequiredBoolean()
    readonly Finalizado: boolean;

}