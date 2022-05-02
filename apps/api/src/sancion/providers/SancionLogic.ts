import { Injectable } from "@nestjs/common";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { SancionRepository } from "../repository/SancionRepository";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";

@Injectable()
export class SancionLogic {

    constructor (
        private readonly sancionRepository: SancionRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        @InjectConnection() private readonly connection: Connection) {}


}