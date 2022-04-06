import { Types } from "mongoose";

export class RegistrarTorneoVM {

    _id?: Types.ObjectId

    Nombre: string;

    FechaInicio: Date;

    FechaFin?: Date;

    Finalizado: boolean;

}