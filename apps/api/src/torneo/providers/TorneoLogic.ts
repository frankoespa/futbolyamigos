import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Torneo } from "../schema/TorneoSchema";
import { TorneoDomain } from "../domain/TorneoDomain";
import { TorneoRepository } from "../repository/TorneoRepository";
import { RegistrarTorneoDTO } from "../dtos/RegistrarTorneoDTO";
import { DropDownVM, Messages, RegistrarTorneoVM, TorneoResultadoDataView } from "@futbolyamigos/data";
import { Types, Connection } from "mongoose";
import { Equipo } from "../../equipo/schema/EquipoSchema";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { InjectConnection } from "@nestjs/mongoose";
import { Partido } from "../../partido/schema/PartidoSchema";

@Injectable()
export class TorneoLogic {

    constructor (
        private readonly torneoRepository: TorneoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private connection: Connection) {}

    async Registrar (registrarTorneoDTO: RegistrarTorneoDTO): Promise<void> {

        const torneoDomainPersisted = await this.torneoRepository.FindWithId(registrarTorneoDTO._id);
        if (torneoDomainPersisted)
        {
            torneoDomainPersisted.Registrar(registrarTorneoDTO);
            torneoDomainPersisted.Save();
        } else
        {
            const torneoDomain = this.documentLoaderService.Create<Torneo, TorneoDomain>(Torneo.name, TorneoDomain);
            torneoDomain.Registrar(registrarTorneoDTO);
            await torneoDomain.Save();

        }
    }

    async ObtenerTodos (): Promise<TorneoResultadoDataView[]> {

        const torneos = await this.torneoRepository.ReadAll();

        const equipoModel = this.documentLoaderService.Query<Equipo>(Equipo.name);

        const torneoResultadoDataView: TorneoResultadoDataView[] = [];

        for (const tDomain of torneos)
        {
            torneoResultadoDataView.push({
                _id: tDomain.Doc._id,
                Nombre: tDomain.Doc.Nombre,
                FechaInicio: tDomain.Doc.FechaInicio,
                FechaFin: tDomain.Doc.FechaFin,
                Finalizado: tDomain.Doc.Finalizado,
                TotalEquipos: await equipoModel.countDocuments({ Torneo: tDomain.Doc._id }).exec()
            })

        }

        return torneoResultadoDataView;
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarTorneoVM> {

        const torneoDomain = await this.torneoRepository.FindWithId(id);

        if (!torneoDomain) throw new ValidationException(Messages.NoSeEncuentraElTorneo);

        return {
            _id: torneoDomain.Doc._id,
            Nombre: torneoDomain.Doc.Nombre,
            FechaInicio: torneoDomain.Doc.FechaInicio,
            FechaFin: torneoDomain.Doc.FechaFin,
            Finalizado: torneoDomain.Doc.Finalizado
        }
    }

    async EliminarPorId (id: Types.ObjectId): Promise<void> {

        const torneoDomain = await this.torneoRepository.FindWithId(id);

        if (!torneoDomain) return;

        const sesion = await this.connection.startSession();

        try
        {

            sesion.startTransaction();

            await this.documentLoaderService.Query<Equipo>(Equipo.name)
                .updateMany({ Torneo: new Types.ObjectId(id) }, { Torneo: null }, { session: sesion }).exec();

            await this.documentLoaderService.Query<Partido>(Partido.name)
                .deleteMany({ Torneo: new Types.ObjectId(id) }, { session: sesion }).exec();

            await torneoDomain.Delete({ session: sesion });

            await sesion.commitTransaction();

            await sesion.endSession();

        } catch (error)
        {
            await sesion.abortTransaction();

            throw new ValidationException(error.message);
        }
    }

    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {
        const torneos = await this.torneoRepository.ReadAll();

        return torneos.map<DropDownVM<Types.ObjectId>>(t => ({
            _id: t.Doc._id,
            Description: t.Doc.Nombre
        }))
    }

    async ObtenerTodosNoFinalizadosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

        const torneos = await this.torneoRepository.ObtenerTodosNoFinalizados();

        return torneos.map<DropDownVM<Types.ObjectId>>(t => ({
            _id: t._id,
            Description: t.Nombre
        }))
    }
}