import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Partido } from "../schema/PartidoSchema";
import { PartidoDomain } from "../domain/PartidoDomain";
import { PartidoRepository } from "../repository/PartidoRepository";
import { RegistrarPartidoDTO } from "../dtos/RegistrarPartidoDTO";
import { Messages, PartidoResultadoDataView, RegistrarPartidoVM } from "@futbolyamigos/data";
import { Types, Connection } from "mongoose";
import { Equipo } from "../../equipo/schema/EquipoSchema";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { InjectConnection } from "@nestjs/mongoose";
import { EquipoDomain } from "../../equipo/domain/EquipoDomain";
import { RegistrarPartidoVO } from "../valueObjects/RegistrarPartidoVO";
import { Cancha } from "../../cancha/schema/CanchaSchema";
import { CanchaDomain } from "../../cancha/domain/CanchaDomain";
import { Torneo } from "../../torneo/schema/TorneoSchema";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";

@Injectable()
export class PartidoLogic {

    constructor (
        private readonly partidoRepository: PartidoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private connection: Connection) {}

    async Registrar (registrarPartidoDTO: RegistrarPartidoDTO): Promise<void> {

        const torneoDomainPersisted = await this.documentLoaderService.GetById<Torneo, TorneoDomain>(Torneo.name, TorneoDomain, registrarPartidoDTO.TorneoID);

        const equipoLocalDomainPersisted = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, registrarPartidoDTO.EquipoLocalID);

        const equipoVisitanteDomainPersisted = await this.documentLoaderService.GetById<Equipo, EquipoDomain>(Equipo.name, EquipoDomain, registrarPartidoDTO.EquipoVisitanteID);

        const canchaDomain = await this.documentLoaderService.GetById<Cancha, CanchaDomain>(Cancha.name, CanchaDomain, registrarPartidoDTO.CanchaID);

        const partidoDomainPersisted = await this.partidoRepository.FindWithId(registrarPartidoDTO._id);

        const vo: RegistrarPartidoVO = {
            Fecha: registrarPartidoDTO.Fecha,
            EquipoLocalDomain: equipoLocalDomainPersisted,
            EquipoVisitanteDomain: equipoVisitanteDomainPersisted,
            CanchaDomain: canchaDomain,
            TorneoDomain: torneoDomainPersisted,
            ResultadoLocal: registrarPartidoDTO.ResultadoLocal,
            ResultadoVisitante: registrarPartidoDTO.ResultadoVisitante
        }

        if (partidoDomainPersisted)
        {
            partidoDomainPersisted.Registrar(vo);
            await partidoDomainPersisted.Save();

        } else
        {
            const partidoDomainNew = this.documentLoaderService.Create<Partido, PartidoDomain>(Partido.name, PartidoDomain);
            partidoDomainNew.Registrar(vo);
            await partidoDomainNew.Save();

        }

    }

    async ObtenerTodos (): Promise<PartidoResultadoDataView[]> {

        const partidos = await this.partidoRepository.ReadAll();

        return partidos.map<PartidoResultadoDataView>(p => ({
            _id: p.Doc._id,
            Fecha: p.Doc.Fecha,
            NombreTorneo: p.Doc.Torneo.Nombre,
            NroCancha: p.Doc.Cancha ? p.Doc.Cancha.Identificador : null,
            NombreEquipoLocal: p.Doc.EquipoLocal.Nombre,
            NombreEquipoVisitante: p.Doc.EquipoVisitante.Nombre,
            ResultadoLocal: p.Doc.ResultadoLocal,
            ResultadoVisitante: p.Doc.ResultadoVisitante
        }))
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarPartidoVM> {

        const partidoDomain = await this.partidoRepository.FindWithId(id);

        if (!partidoDomain) throw new ValidationException(Messages.NoSeEncuentraElPartido);

        return {
            _id: partidoDomain.Doc._id,
            Fecha: partidoDomain.Doc.Fecha,
            TorneoID: partidoDomain.Doc.Torneo._id,
            CanchaID: partidoDomain.Doc.Cancha ? partidoDomain.Doc.Cancha._id : null,
            EquipoLocalID: partidoDomain.Doc.EquipoLocal._id,
            EquipoVisitanteID: partidoDomain.Doc.EquipoVisitante._id,
            ResultadoLocal: partidoDomain.Doc.ResultadoLocal,
            ResultadoVisitante: partidoDomain.Doc.ResultadoVisitante
        }
    }

    // async EliminarPorId (id: Types.ObjectId): Promise<void> {

    //     const torneoDomain = await this.torneoRepository.FindWithId(id);

    //     if (!torneoDomain) return;

    //     const sesion = await this.connection.startSession();

    //     try
    //     {

    //         sesion.startTransaction();

    //         await this.documentLoaderService.Query<Equipo>(Equipo.name)
    //             .updateMany({ Torneo: id }, { Torneo: null }, { session: sesion }).exec();

    //         await torneoDomain.Delete({ session: sesion });

    //         await sesion.commitTransaction();

    //         await sesion.endSession();

    //     } catch (error)
    //     {
    //         await sesion.abortTransaction();

    //         throw new ValidationException(error.message);
    //     }
    // }

    // async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {
    //     const torneos = await this.torneoRepository.ReadAll();

    //     return torneos.map<DropDownVM<Types.ObjectId>>(t => ({
    //         _id: t.Doc._id,
    //         Description: t.Doc.Nombre
    //     }))
    // }

    // async ObtenerTodosNoFinalizadosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

    //     const torneos = await this.torneoRepository.ObtenerTodosNoFinalizados();

    //     return torneos.map<DropDownVM<Types.ObjectId>>(t => ({
    //         _id: t._id,
    //         Description: t.Nombre
    //     }))
    // }
}