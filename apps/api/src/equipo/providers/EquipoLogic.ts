import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Equipo } from "../schema/EquipoSchema";
import { EquipoDomain } from "../domain/EquipoDomain";
import { EquipoRepository } from "../repository/EquipoRepository";
import { RegistrarEquipoDTO } from "../dtos/RegistrarEquipoDTO";
import { EquipoResultadoDataView, RegistrarEquipoVM, Messages, DropDownVM } from "@futbolyamigos/data";
import { Torneo } from "../../torneo/schema/TorneoSchema";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { Types, Connection } from "mongoose";
import { Jugador } from "../../jugador/schema/JugadorSchema";
import { InjectConnection } from "@nestjs/mongoose";
import { Partido } from "../../partido/schema/PartidoSchema";

@Injectable()
export class EquipoLogic {

    constructor (
        private readonly equipoRepository: EquipoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private connection: Connection) {}

    async Registrar (registrarEquipoDTO: RegistrarEquipoDTO): Promise<void> {

        const equipoDomainPersisted = await this.equipoRepository.FindWithId(registrarEquipoDTO._id);

        let torneoDomainPersisted: TorneoDomain = null;

        torneoDomainPersisted = await this.documentLoaderService.GetById<Torneo, TorneoDomain>(Torneo.name, TorneoDomain, registrarEquipoDTO.TorneoID);

        if (registrarEquipoDTO.TorneoID && !torneoDomainPersisted) throw new ValidationException(Messages.NoSeEncuentraElTorneo);

        // if (
        //     equipoDomainPersisted &&
        //     equipoDomainPersisted.Doc.Torneo &&
        //     torneoDomainPersisted &&
        //     torneoDomainPersisted.Doc._id.toString() !== equipoDomainPersisted.Doc.Torneo._id.toString() &&
        //     !equipoDomainPersisted.Doc.Torneo.Finalizado)
        // {
        //     throw new ValidationException(Messages.NoEsPosibleModificarElTorneoPorQueNoFinalizo);
        // }

        if (equipoDomainPersisted)
        {

            equipoDomainPersisted.Registrar(registrarEquipoDTO.Nombre, torneoDomainPersisted);

            equipoDomainPersisted.Save();
        } else
        {
            const equipoDomain = this.documentLoaderService.Create<Equipo, EquipoDomain>(Equipo.name, EquipoDomain);

            equipoDomain.Registrar(registrarEquipoDTO.Nombre, torneoDomainPersisted);

            await equipoDomain.Save();

        }
    }

    async ObtenerTodos (): Promise<EquipoResultadoDataView[]> {

        const equipos = await this.equipoRepository.ReadAll();

        const jugadorModel = this.documentLoaderService.Query<Jugador>(Jugador.name);

        const equipoResultadoDataView: EquipoResultadoDataView[] = [];

        for (const eDomain of equipos)
        {
            equipoResultadoDataView.push({
                _id: eDomain.Doc._id,
                Nombre: eDomain.Doc.Nombre,
                NombreTorneo: eDomain.Doc.Torneo ? eDomain.Doc.Torneo.Nombre : null,
                TotalJugadores: await jugadorModel.countDocuments({ Equipo: eDomain.Doc._id }).exec()
            })
        }

        return equipoResultadoDataView;
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarEquipoVM> {

        const equipoDomain = await this.equipoRepository.FindWithId(id);

        if (!equipoDomain) throw new ValidationException(Messages.NoSeEncuentraElEquipo);

        return {
            _id: equipoDomain.Doc._id,
            Nombre: equipoDomain.Doc.Nombre,
            TorneoID: equipoDomain.Doc.Torneo ? equipoDomain.Doc.Torneo._id : null
        }
    }

    async EliminarPorId (id: Types.ObjectId): Promise<void> {

        const equipoDomain = await this.equipoRepository.FindWithId(id);

        if (!equipoDomain) return null;

        const tienePartidosJugadosOporJugar = await this.TienePartidosJugadosOporJugar(equipoDomain);

        if (tienePartidosJugadosOporJugar)
        {
            throw new ValidationException(Messages.NoSePuedeEliminarElEquipoPorqueTienePartidos)
        }

        const sesion = await this.connection.startSession();

        try
        {

            sesion.startTransaction();

            await this.documentLoaderService.Query<Jugador>(Jugador.name)
                .updateMany({ Equipo: new Types.ObjectId(id) }, { Equipo: null }, { session: sesion }).exec();

            await equipoDomain.Delete({ session: sesion })

            await sesion.commitTransaction();

            await sesion.endSession();

        } catch (error)
        {
            await sesion.abortTransaction();

            throw new ValidationException(error.message);
        }

    }

    private async TienePartidosJugadosOporJugar (equipoDomain: EquipoDomain) {
        const partidosJugadosOporJugar = await this.documentLoaderService
            .Query<Partido>(Partido.name)
            .find({
                $or: [
                    { EquipoLocal: new Types.ObjectId(equipoDomain.Doc._id) },
                    { EquipoVisitante: new Types.ObjectId(equipoDomain.Doc._id) }
                ]
            })
            .exec();

        return partidosJugadosOporJugar.length > 0;
    }

    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

        const equipos = await this.equipoRepository.ReadAll();

        return equipos.map<DropDownVM<Types.ObjectId>>(t => ({
            _id: t.Doc._id,
            Description: t.Doc.Nombre
        }))
    }

    async ObtenerTodosDiscriminandoDropDown (torneoID: string, equipoID?: string): Promise<DropDownVM<Types.ObjectId>[]> {

        const equipos = await this.equipoRepository.ObtenerTodosDiscriminandoDropDown(torneoID, equipoID);

        return equipos.map<DropDownVM<Types.ObjectId>>(t => ({
            _id: t._id,
            Description: t.Nombre
        }))
    }
}