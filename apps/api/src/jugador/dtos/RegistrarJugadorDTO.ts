import { OptionalDate } from '../../global/base/validations/OptionalDate';
import { RequiredString } from '../../global/base/validations/RequiredString';
import { Types } from "mongoose";
import { OptionalMongoId } from '../../global/base/validations/OptionalMongoId';
import { OptionalString } from '../../global/base/validations/OptionalString';
import { OptionalEmail } from '../../global/base/validations/OptionalEmail';

export class RegistrarJugadorDTO {

    @OptionalMongoId()
    _id?: Types.ObjectId

    @RequiredString()
    readonly Nombres: string;

    @RequiredString()
    readonly Apellidos: string;

    @OptionalDate()
    readonly FechaNacimiento?: string;

    @RequiredString()
    readonly Dni: string;

    @OptionalEmail()
    readonly Email?: string;

    @OptionalString()
    readonly Telefono?: string;

    @OptionalMongoId()
    readonly EquipoID?: Types.ObjectId

}