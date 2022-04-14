import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RegistrarTorneoDTO } from '../dtos/RegistrarTorneoDTO';
import { TorneoLogic } from '../providers/TorneoLogic';
import { Auth } from '../../auth/decorators/AuthComposition';
import { DropDownVM, RegistrarTorneoVM, Roles, TorneoResultadoDataView } from "@futbolyamigos/data";
import { Types } from "mongoose";

@Controller('torneo')
export class TorneoController {
    constructor (private readonly torneoLogic: TorneoLogic) {}

    @Auth([Roles.Admin])
    @Post()
    async Registrar (@Body() registrarTorneoDTO: RegistrarTorneoDTO): Promise<void> {

        return await this.torneoLogic.Registrar(registrarTorneoDTO);
    }

    @Auth([Roles.Admin])
    @Get()
    async ObtenerTodos (): Promise<TorneoResultadoDataView[]> {

        return await this.torneoLogic.ObtenerTodos();
    }

    @Auth([Roles.Admin])
    @Get(':id')
    async ObtenerPorId (@Param('id') id: Types.ObjectId): Promise<RegistrarTorneoVM> {

        return await this.torneoLogic.ObtenerPorId(id);
    }

    @Auth([Roles.Admin])
    @Delete(':id')
    async Eliminar (@Param('id') id: Types.ObjectId): Promise<void> {

        return await this.torneoLogic.EliminarPorId(id);
    }

    @Auth([Roles.Admin])
    @Get('dropdown/todos')
    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

        return await this.torneoLogic.ObtenerTodosDropDown();
    }
}
