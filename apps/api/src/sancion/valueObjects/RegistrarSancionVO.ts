import { EquipoDomain } from "../../equipo/domain/EquipoDomain";
import { JugadorDomain } from "../../jugador/domain/JugadorDomain";
import { PartidoDomain } from "../../partido/domain/PartidoDomain";
import { TarjetaDomain } from "../../tarjeta/domain/TarjetaDomain";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";

export class RegistrarSancionVO {

    PartidoDomain: PartidoDomain

    TorneoDomain: TorneoDomain

    EquipoDomain: EquipoDomain;

    JugadorDomain: JugadorDomain;

    TarjetaDomain: TarjetaDomain;

    TotalFechas?: number;
}