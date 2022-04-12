import { DomainBase } from '../../global/base/domain/DomainBase';
import { Cancha } from '../schema/CanchaSchema';
import { RegistrarCanchaDTO } from '../dtos/RegistrarCanchaDTO';

export class CanchaDomain extends DomainBase<Cancha> {

    Registrar (registrarCanchaDTO: RegistrarCanchaDTO): void {
        this.doc.Nombre = registrarCanchaDTO.Nombre;
        this.doc.Identificador = registrarCanchaDTO.Identificador;
    }

}