import { RegistrarGolVM } from "../gol/RegistrarGolVM";
import { RegistrarSancionVM } from "../sancion/RegistrarSancionVM";

export class RegistrarPartidoVM {

    _id?: string

    Fecha: Date;

    TorneoID: string;

    CanchaID?: string;

    EquipoLocalID: string;

    EquipoVisitanteID: string;

    ResultadoLocal?: number;

    ResultadoVisitante?: number;

    GolesEquipoLocal: RegistrarGolVM[];

    GolesEquipoVisitante: RegistrarGolVM[]

    SancionesEquipoLocal: RegistrarSancionVM[]

    SancionesEquipoVisitante: RegistrarSancionVM[]

}