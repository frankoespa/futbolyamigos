import { DomainBase } from '../../global/base/domain/DomainBase';
import { Gol } from '../schema/GolSchema';
import { RegistrarGolVO } from '../valueObjects/RegistrarGolVO';

export class GolDomain extends DomainBase<Gol> {

    Registrar (vo: RegistrarGolVO): void {
        this.doc.Partido = vo.PartidoDomain.Doc;
        this.doc.Torneo = vo.TorneoDomain.Doc;
        this.doc.Equipo = vo.EquipoDomain.Doc;
        this.doc.Jugador = vo.JugadorDomain.Doc;
        this.doc.Cantidad = vo.Cantidad;
    }

}