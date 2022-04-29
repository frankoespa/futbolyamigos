import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { TarjetaRepository } from "../repository/TarjetaRepository";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { DropDownVM } from "@futbolyamigos/data";

@Injectable()
export class TarjetaLogic {

    constructor (
        private readonly tarjetaRepository: TarjetaRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private readonly connection: Connection) {}

    async ObtenerTodosDropDown (): Promise<DropDownVM<number>[]> {
        const tarjetas = await this.tarjetaRepository.ReadAll();

        return tarjetas.map<DropDownVM<number>>(t => ({
            _id: t.Doc._id,
            Description: t.Doc.Description
        }))
    }
}