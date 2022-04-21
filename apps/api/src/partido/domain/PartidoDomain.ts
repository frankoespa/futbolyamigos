import { DomainBase } from '../../global/base/domain/DomainBase';
import { Partido } from '../schema/PartidoSchema';
import * as moment from "moment";
import { RegistrarPartidoVO } from '../valueObjects/RegistrarPartidoVO';

export class PartidoDomain extends DomainBase<Partido> {

    Registrar (vo: RegistrarPartidoVO): void {
        this.doc.Fecha = moment(vo.Fecha).toDate();
        this.doc.Torneo = vo.TorneoDomain.Doc;
        this.doc.Cancha = vo.CanchaDomain ? vo.CanchaDomain.Doc : null;
        this.doc.EquipoLocal = vo.EquipoLocalDomain.Doc;
        this.doc.EquipoVisitante = vo.EquipoVisitanteDomain.Doc;
        this.doc.ResultadoLocal = vo.ResultadoLocal;
        this.doc.ResultadoVisitante = vo.ResultadoVisitante
    }

}