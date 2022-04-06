import { DomainBase } from '../../global/base/domain/DomainBase';
import { Torneo } from '../schema/TorneoSchema';
import * as moment from "moment";
import { RegistrarTorneoDTO } from '../dtos/RegistrarTorneoDTO';

export class TorneoDomain extends DomainBase<Torneo> {

    Registrar (registrarTorneoDTO: RegistrarTorneoDTO): void {
        this.doc.Nombre = registrarTorneoDTO.Nombre;
        this.doc.FechaInicio = moment(registrarTorneoDTO.FechaInicio).toDate();
        this.doc.FechaFin = registrarTorneoDTO.FechaFin ? moment(registrarTorneoDTO.FechaFin).toDate() : null;
        this.doc.Finalizado = registrarTorneoDTO.Finalizado;
    }

}