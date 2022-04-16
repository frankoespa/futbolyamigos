import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Torneo } from "../schema/TorneoSchema";
import { TorneoDomain } from "../domain/TorneoDomain";
import { TorneoRepository } from "../repository/TorneoRepository";
import { RegistrarTorneoDTO } from "../dtos/RegistrarTorneoDTO";
import { DropDownVM, Messages, RegistrarTorneoVM, TorneoResultadoDataView } from "@futbolyamigos/data";
import { Types } from "mongoose";
import { Equipo } from "../../equipo/schema/EquipoSchema";
import { ValidationException } from "../../global/base/exceptions/ValidationException";

@Injectable()
export class TorneoLogic {

    constructor (
        private readonly torneoRepository: TorneoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService) {}

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
        if (!torneoDomain) return null;

        await torneoDomain.Delete()
    }

    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {
        const torneos = await this.torneoRepository.ReadAll();

        return torneos.map<DropDownVM<Types.ObjectId>>(t => ({
            _id: t.Doc._id,
            Description: t.Doc.Nombre
        }))
    }
}