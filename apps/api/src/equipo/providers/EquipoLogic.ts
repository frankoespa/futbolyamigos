import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { Equipo } from "../schema/EquipoSchema";
import { EquipoDomain } from "../domain/EquipoDomain";
import { EquipoRepository } from "../repository/EquipoRepository";
import { RegistrarEquipoDTO } from "../dtos/RegistrarEquipoDTO";
import { EquipoResultadoDataView, RegistrarEquipoVM, Messages } from "@futbolyamigos/data";
import { Torneo } from "../../torneo/schema/TorneoSchema";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { Types } from "mongoose";

@Injectable()
export class EquipoLogic {

    constructor (
        private readonly equipoRepository: EquipoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService) {}

    async Registrar (registrarEquipoDTO: RegistrarEquipoDTO): Promise<void> {

        const equipoDomainPersisted = await this.equipoRepository.FindWithId(registrarEquipoDTO._id);

        const torneoDomainPersisted = await this.documentLoaderService.GetById<Torneo, TorneoDomain>(Torneo.name, TorneoDomain, registrarEquipoDTO.TorneoID);

        if (!torneoDomainPersisted) throw new ValidationException(Messages.ElTorneoNoExiste)
        else
        {
            if (torneoDomainPersisted.Doc.Finalizado) throw new ValidationException(Messages.ElTorneoSeEncuentraFinalizado);
        }

        if (equipoDomainPersisted)
        {
            equipoDomainPersisted.Registrar(registrarEquipoDTO.Nombre, torneoDomainPersisted.Doc);

            equipoDomainPersisted.Save();
        } else
        {
            const equipoDomain = this.documentLoaderService.Create<Equipo, EquipoDomain>(Equipo.name, EquipoDomain);

            equipoDomain.Registrar(registrarEquipoDTO.Nombre, torneoDomainPersisted.Doc);

            await equipoDomain.Save();

        }
    }

    async ObtenerTodos (): Promise<EquipoResultadoDataView[]> {
        const equipos = await this.equipoRepository.ReadAll();

        return equipos.map<EquipoResultadoDataView>(t => ({
            _id: t.Doc._id,
            Nombre: t.Doc.Nombre,
            NombreTorneo: t.Doc.Torneo.Nombre
        }))
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarEquipoVM> {

        const equipoDomain = await this.equipoRepository.FindWithId(id);

        if (!equipoDomain) throw new ValidationException(Messages.NoSeEncuentraElEquipo);

        return {
            _id: equipoDomain.Doc._id,
            Nombre: equipoDomain.Doc.Nombre,
            TorneoID: equipoDomain.Doc.Torneo._id
        }
    }

    async EliminarPorId (id: Types.ObjectId): Promise<void> {
        const equipoDomain = await this.equipoRepository.FindWithId(id);
        if (!equipoDomain) return null;

        await equipoDomain.Delete()
    }
}