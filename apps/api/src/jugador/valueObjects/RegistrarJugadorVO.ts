import { EquipoDomain } from "../../equipo/domain/EquipoDomain";

export class RegistrarJugadorVO {

    Nombres: string;

    Apellidos: string;

    FechaNacimiento?: string;

    Dni: string;

    Email?: string;

    Telefono?: string;

    EquipoDomain: EquipoDomain
}