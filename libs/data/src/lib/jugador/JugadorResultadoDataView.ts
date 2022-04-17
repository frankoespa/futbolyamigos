import { Types } from "mongoose";

export class JugadorResultadoDataView {

    _id: Types.ObjectId

    Nombres: string;

    Apellidos: string;

    FechaNacimiento?: Date;

    Dni: string;

    Email?: string;

    Telefono?: string;

    NombreEquipo?: string;

}