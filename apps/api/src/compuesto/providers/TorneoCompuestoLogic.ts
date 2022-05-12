import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { TorneoCompuesto } from "../schema/TorneoCompuestoSchema";
import { TorneoCompuestoDomain } from "../domain/TorneoCompuestoDomain";
import { TorneoCompuestoRepository } from "../repository/TorneoCompuestoRepository";
import { RegistrarTorneoCompuestoDTO } from "../dtos/RegistrarTorneoCompuestoDTO";
import { Messages, DropDownVM, TorneoCompuestoResultadoDataView, RegistrarTorneoCompuestoVM } from "@futbolyamigos/data";
import { Torneo } from "../../torneo/schema/TorneoSchema";
import { TorneoDomain } from "../../torneo/domain/TorneoDomain";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { Types, Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";

@Injectable()
export class TorneoCompuestoLogic {

    constructor (
        private readonly torneoCompuestoRepository: TorneoCompuestoRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private connection: Connection) {}

    async Registrar (registrarTorneoCompuestoDTO: RegistrarTorneoCompuestoDTO): Promise<void> {

        const torneoCompuestoDomainPersisted = await this.torneoCompuestoRepository.FindWithId(registrarTorneoCompuestoDTO._id);

        let torneoAperturaDomainPersisted: TorneoDomain = null;
        let torneoClausuraDomainPersisted: TorneoDomain = null;

        torneoAperturaDomainPersisted = await this.documentLoaderService.GetById<Torneo, TorneoDomain>(Torneo.name, TorneoDomain, registrarTorneoCompuestoDTO.TorneoAperturaID);

        torneoClausuraDomainPersisted = await this.documentLoaderService.GetById<Torneo, TorneoDomain>(Torneo.name, TorneoDomain, registrarTorneoCompuestoDTO.TorneoClausuraID);

        if (registrarTorneoCompuestoDTO.TorneoAperturaID && !torneoAperturaDomainPersisted) throw new ValidationException(Messages.NoSeEncuentraElTorneo);

        if (registrarTorneoCompuestoDTO.TorneoClausuraID && !torneoClausuraDomainPersisted) throw new ValidationException(Messages.NoSeEncuentraElTorneo);

        if (torneoCompuestoDomainPersisted)
        {

            torneoCompuestoDomainPersisted.Registrar(registrarTorneoCompuestoDTO.Nombre, torneoAperturaDomainPersisted, torneoClausuraDomainPersisted);

            torneoCompuestoDomainPersisted.Save();
        } else
        {
            const torneoCompuestoDomainNew = this.documentLoaderService.Create<TorneoCompuesto, TorneoCompuestoDomain>(TorneoCompuesto.name, TorneoCompuestoDomain);

            torneoCompuestoDomainNew.Registrar(registrarTorneoCompuestoDTO.Nombre, torneoAperturaDomainPersisted, torneoClausuraDomainPersisted);

            await torneoCompuestoDomainNew.Save();

        }
    }

    async ObtenerTodos (): Promise<TorneoCompuestoResultadoDataView[]> {

        const listaTorneosCompuestos = await this.torneoCompuestoRepository.ReadAll();

        return listaTorneosCompuestos.map<TorneoCompuestoResultadoDataView>(t => ({
            _id: t.Doc._id,
            Nombre: t.Doc.Nombre,
            NombreTorneoApertura: t.Doc.TorneoApertura.Nombre,
            NombreTorneoClausura: t.Doc.TorneoClausura.Nombre
        }));

    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarTorneoCompuestoVM> {

        const torneoCompuestoDomain = await this.torneoCompuestoRepository.FindWithId(id);

        if (!torneoCompuestoDomain) throw new ValidationException(Messages.NoSeEncuentraElTorneoCompuesto);

        return {
            _id: torneoCompuestoDomain.Doc._id,
            Nombre: torneoCompuestoDomain.Doc.Nombre,
            TorneoAperturaID: torneoCompuestoDomain.Doc.TorneoApertura._id,
            TorneoClausuraID: torneoCompuestoDomain.Doc.TorneoClausura._id
        }
    }

    async EliminarPorId (id: Types.ObjectId): Promise<void> {

        const torneoCompuestoDomain = await this.torneoCompuestoRepository.FindWithId(id);

        if (!torneoCompuestoDomain) return null;

        const sesion = await this.connection.startSession();

        try
        {

            sesion.startTransaction();

            await torneoCompuestoDomain.Delete({ session: sesion })

            await sesion.commitTransaction();

            await sesion.endSession();

        } catch (error)
        {
            await sesion.abortTransaction();

            throw new ValidationException(error.message);
        }

    }

    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

        const listaTorneosCompuestos = await this.torneoCompuestoRepository.ReadAll();

        return listaTorneosCompuestos.map<DropDownVM<Types.ObjectId>>(t => ({
            _id: t.Doc._id,
            Description: t.Doc.Nombre
        }))
    }

}