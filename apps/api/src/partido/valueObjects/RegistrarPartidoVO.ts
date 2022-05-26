import { CanchaDomain } from "../../cancha/domain/CanchaDomain";
import { EquipoDomain } from "../../equipo/domain/EquipoDomain";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";

export class RegistrarPartidoVO {

    Fecha: string;

    EquipoLocalDomain: EquipoDomain;

    EquipoVisitanteDomain: EquipoDomain;

    CanchaDomain?: CanchaDomain;

    TorneoDomain: TorneoDomain;

    ResultadoLocal?: number;

    ResultadoVisitante?: number;

    NroFecha: number;

}