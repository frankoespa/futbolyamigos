import { DomainBase } from '../../global/base/domain/DomainBase';
import { Equipo } from '../schema/EquipoSchema';
import { Torneo } from '../../torneo/schema/TorneoSchema';

export class EquipoDomain extends DomainBase<Equipo> {

    Registrar (nombre: string, torneo: Torneo): void {
        this.doc.Nombre = nombre;
        this.doc.Torneo = torneo;
    }

}