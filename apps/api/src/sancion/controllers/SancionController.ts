import { Controller, Get, Param } from '@nestjs/common';
import { SancionLogic } from '../providers/SancionLogic';
import { Types } from "mongoose";
import { LineaSancionadoVM } from "@futbolyamigos/data";

@Controller('sancion')
export class SancionController {
    constructor (private readonly sancionLogic: SancionLogic) {}

    @Get('sancionados/:torneoID')
    async ObtenerSancionados (@Param('torneoID') torneoID: Types.ObjectId): Promise<LineaSancionadoVM[]> {
        return await this.sancionLogic.ObtenerSancionados(torneoID);
    }

}
