import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { CanchaDomain } from "../domain/CanchaDomain";
import { RegistrarCanchaDTO } from "../dtos/RegistrarCanchaDTO";
import { CanchaRepository } from "../repository/CanchaRepository";
import { Cancha } from "../schema/CanchaSchema";
import { DropDownVM, RegistrarCanchaVM, Messages } from "@futbolyamigos/data";
import { Types, Connection } from "mongoose";
import { ValidationException } from "../../global/base/exceptions/ValidationException";
import { InjectConnection } from "@nestjs/mongoose";
import { Partido } from "../../partido/schema/PartidoSchema";

@Injectable()
export class CanchaLogic {

    constructor (
        private readonly canchaRepository: CanchaRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private readonly connection: Connection) {}

    async Registrar (registrarCanchaDTO: RegistrarCanchaDTO): Promise<void> {

        const canchaDomainPersisted = await this.canchaRepository.FindWithId(registrarCanchaDTO._id);
        if (canchaDomainPersisted)
        {
            if (registrarCanchaDTO.Identificador !== canchaDomainPersisted.Doc.Identificador)
            {
                if (await this.canchaRepository.ElIdentificadorEstaEnUso(registrarCanchaDTO.Identificador))
                    throw new ValidationException(Messages.IdentificadorEnUso);
            }

            canchaDomainPersisted.Registrar(registrarCanchaDTO);
            canchaDomainPersisted.Save();
        } else
        {
            if (await this.canchaRepository.ElIdentificadorEstaEnUso(registrarCanchaDTO.Identificador))
                throw new ValidationException(Messages.IdentificadorEnUso);

            const canchaDomainNew = this.documentLoaderService.Create<Cancha, CanchaDomain>(Cancha.name, CanchaDomain);
            canchaDomainNew.Registrar(registrarCanchaDTO);
            await canchaDomainNew.Save();

        }
    }

    async ObtenerTodos (): Promise<RegistrarCanchaVM[]> {
        const canchas = await this.canchaRepository.ReadAll();

        return canchas.map<RegistrarCanchaVM>(t => ({
            _id: t.Doc._id,
            Nombre: t.Doc.Nombre,
            Identificador: t.Doc.Identificador
        }))
    }

    async ObtenerPorId (id: Types.ObjectId): Promise<RegistrarCanchaVM> {

        const canchaDomain = await this.canchaRepository.FindWithId(id);

        if (!canchaDomain) throw new ValidationException(Messages.NoSeEncuentraLaCancha);


        return {
            _id: canchaDomain.Doc._id,
            Nombre: canchaDomain.Doc.Nombre,
            Identificador: canchaDomain.Doc.Identificador
        }
    }

    async EliminarPorId (id: Types.ObjectId): Promise<void> {
        const canchaDomain = await this.canchaRepository.FindWithId(id);

        if (!canchaDomain) return null;

        const session = await this.connection.startSession();

        try
        {

            session.startTransaction();

            await this.documentLoaderService.Query<Partido>(Partido.name)
                .updateMany({ Cancha: new Types.ObjectId(id) }, { Cancha: null }, { session }).exec();

            await canchaDomain.Delete({ session });

            await session.commitTransaction();

            await session.endSession();

        } catch (error)
        {
            await session.abortTransaction();

            throw new ValidationException(error.message);
        }
    }

    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {
        let canchas = await this.canchaRepository.ReadAll();

        canchas = canchas.sort((a, b) => a.Doc.Identificador - b.Doc.Identificador);

        return canchas.map<DropDownVM<Types.ObjectId>>(t => ({
            _id: t.Doc._id,
            Description: `${t.Doc.Nombre}(Num: ${t.Doc.Identificador})`
        }))
    }
}