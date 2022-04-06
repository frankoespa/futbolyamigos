import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Torneo } from "../schema/TorneoSchema";
import { TorneoDomain } from "../domain/TorneoDomain";
import { TorneoRepository } from "../repository/TorneoRepository";
import { RegistrarTorneoDTO } from "../dtos/RegistrarTorneoDTO";
import { RegistrarTorneoVM } from "@futbolyamigos/data";
import { Types } from "mongoose";

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

    async ObtenerTodos (): Promise<RegistrarTorneoVM[]> {
        const torneos = await this.torneoRepository.ReadAll();

        return torneos.map<RegistrarTorneoVM>(t => ({
            _id: t.Doc._id,
            Nombre: t.Doc.Nombre,
            FechaInicio: t.Doc.FechaInicio,
            FechaFin: t.Doc.FechaFin,
            Finalizado: t.Doc.Finalizado
        }))
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarTorneoVM> {
        const torneoDomain = await this.torneoRepository.FindWithId(id);
        if (!torneoDomain) return null;

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
}