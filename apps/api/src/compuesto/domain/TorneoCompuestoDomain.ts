import { DomainBase } from '../../global/base/domain/DomainBase';
import { TorneoCompuesto } from '../schema/TorneoCompuestoSchema';
import { TorneoDomain } from '../../torneo/domain/TorneoDomain';

export class TorneoCompuestoDomain extends DomainBase<TorneoCompuesto> {

    Registrar (nombre: string, torneoAperturaDomain: TorneoDomain, torneoClausuraDomain: TorneoDomain): void {
        this.doc.Nombre = nombre;
        this.doc.TorneoApertura = torneoAperturaDomain.Doc;
        this.doc.TorneoClausura = torneoClausuraDomain.Doc;
    }

}