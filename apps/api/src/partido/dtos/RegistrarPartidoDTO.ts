import { RequiredDate } from '../../global/base/validations/RequiredDate';
import { Types } from "mongoose";
import { OptionalMongoId } from '../../global/base/validations/OptionalMongoId';
import { RequiredMongoId } from '../../global/base/validations/RequiredMongoId';
import { OptionalInt } from '../../global/base/validations/OptionalInt';
import { IsArray } from 'class-validator';
import { RegistrarGolDTO } from './RegistrarGolDTO';

export class RegistrarPartidoDTO {

    @OptionalMongoId()
    _id?: Types.ObjectId

    @RequiredDate()
    readonly Fecha: string;

    @OptionalMongoId()
    readonly CanchaID?: Types.ObjectId;

    @RequiredMongoId()
    readonly TorneoID: Types.ObjectId;

    @RequiredMongoId()
    readonly EquipoLocalID: Types.ObjectId;

    @RequiredMongoId()
    readonly EquipoVisitanteID: Types.ObjectId;

    @OptionalInt()
    readonly ResultadoLocal?: number;

    @OptionalInt()
    readonly ResultadoVisitante?: number;

    @IsArray()
    GolesEquipoLocal: RegistrarGolDTO[]

    @IsArray()
    GolesEquipoVisitante: RegistrarGolDTO[]

}