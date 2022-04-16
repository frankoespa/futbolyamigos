import { DomainBase } from '../../global/base/domain/DomainBase';
import { Jugador } from '../schema/JugadorSchema';
import * as moment from "moment";
import { RegistrarJugadorVO } from '../valueObjects/RegistrarJugadorVO';

export class JugadorDomain extends DomainBase<Jugador> {

    Registrar (registrarJugadorVO: RegistrarJugadorVO): void {
        this.doc.Nombres = registrarJugadorVO.Nombres;
        this.doc.Apellidos = registrarJugadorVO.Apellidos;
        this.doc.FechaNacimiento = registrarJugadorVO.FechaNacimiento ? moment(registrarJugadorVO.FechaNacimiento).toDate() : null;
        this.doc.Dni = registrarJugadorVO.Dni;
        this.doc.Email = registrarJugadorVO.Email;
        this.doc.Telefono = registrarJugadorVO.Telefono;
        this.doc.Equipo = registrarJugadorVO.EquipoDomain.Doc
    }

}