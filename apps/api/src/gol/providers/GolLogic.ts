import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { GolRepository } from "../repository/GolRepository";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";

@Injectable()
export class GolLogic {

    constructor (
        private readonly golRepository: GolRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private readonly connection: Connection) {}


}