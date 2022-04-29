import { EquipoDomain } from "../../equipo/domain/EquipoDomain";
import { JugadorDomain } from "../../jugador/domain/JugadorDomain";
import { PartidoDomain } from "../../partido/domain/PartidoDomain";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";

export class RegistrarGolVO {

    PartidoDomain: PartidoDomain

    TorneoDomain: TorneoDomain

    EquipoDomain: EquipoDomain;

    JugadorDomain: JugadorDomain;

    Cantidad: number;
}