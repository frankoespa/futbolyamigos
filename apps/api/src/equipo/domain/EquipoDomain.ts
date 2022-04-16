import { DomainBase } from '../../global/base/domain/DomainBase';
import { Equipo } from '../schema/EquipoSchema';
import { Torneo } from '../../torneo/schema/TorneoSchema';
import { TorneoDomain } from '../../torneo/domain/TorneoDomain';

export class EquipoDomain extends DomainBase<Equipo> {

    Registrar (nombre: string, torneoDomain: TorneoDomain): void {
        this.doc.Nombre = nombre;
        this.doc.Torneo = torneoDomain ? torneoDomain.Doc : null;
    }

}