import { Types } from "mongoose";

export class TorneoResultadoDataView {

    _id?: Types.ObjectId

    Nombre: string;

    FechaInicio: Date;

    FechaFin?: Date;

    Finalizado: boolean;

    TotalEquipos: number

}