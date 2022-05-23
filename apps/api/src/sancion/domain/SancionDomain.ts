import { DomainBase } from '../../global/base/domain/DomainBase';
import { Sancion } from '../schema/SancionSchema';
import { RegistrarSancionVO } from '../valueObjects/RegistrarSancionVO';

export class SancionDomain extends DomainBase<Sancion> {

    Registrar (vo: RegistrarSancionVO): void {
        this.doc.Partido = vo.PartidoDomain.Doc;
        this.doc.Torneo = vo.TorneoDomain.Doc;
        this.doc.Equipo = vo.EquipoDomain.Doc;
        this.doc.Jugador = vo.JugadorDomain.Doc;
        this.doc.Tarjeta = vo.TarjetaDomain.Doc;
        this.doc.TotalFechas = vo.TotalFechas;
    }

}