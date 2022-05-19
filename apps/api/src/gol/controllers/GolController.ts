import { Controller, Get, Param } from '@nestjs/common';
import { GolLogic } from '../providers/GolLogic';
import { Types } from "mongoose";
import { LineaGoleadorVM } from "@futbolyamigos/data";

@Controller('gol')
export class GolController {
    constructor (private readonly golLogic: GolLogic) {}

    @Get('goleadores/:id')
    async ObtenerGoleadores (@Param('id') torneoID: Types.ObjectId): Promise<LineaGoleadorVM[]> {
        return await this.golLogic.ObtenerGoleadores(torneoID);
    }

}
