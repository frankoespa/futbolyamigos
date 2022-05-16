import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RegistrarTorneoCompuestoDTO } from '../dtos/RegistrarTorneoCompuestoDTO';
import { TorneoCompuestoLogic } from '../providers/TorneoCompuestoLogic';
import { Auth } from '../../auth/decorators/AuthComposition';
import { Roles, DropDownVM, TorneoCompuestoResultadoDataView, RegistrarTorneoCompuestoVM } from "@futbolyamigos/data";
import { Types } from "mongoose";

@Controller('torneoCompuesto')
export class TorneoCompuestoController {
    constructor (private readonly torneoCompuestoLogic: TorneoCompuestoLogic) {}

    @Auth([Roles.Admin])
    @Post()
    async Registrar (@Body() registrarTorneoCompuestoDTO: RegistrarTorneoCompuestoDTO): Promise<void> {

        return await this.torneoCompuestoLogic.Registrar(registrarTorneoCompuestoDTO);
    }

    @Auth([Roles.Admin])
    @Get()
    async ObtenerTodos (): Promise<TorneoCompuestoResultadoDataView[]> {

        return await this.torneoCompuestoLogic.ObtenerTodos();
    }

    @Auth([Roles.Admin])
    @Get(':id')
    async ObtenerPorId (@Param('id') id: Types.ObjectId): Promise<RegistrarTorneoCompuestoVM> {

        return await this.torneoCompuestoLogic.ObtenerPorId(id);
    }

    @Auth([Roles.Admin])
    @Delete(':id')
    async Eliminar (@Param('id') id: Types.ObjectId): Promise<void> {

        return await this.torneoCompuestoLogic.EliminarPorId(id);
    }

    @Get('dropdown/todos')
    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

        return await this.torneoCompuestoLogic.ObtenerTodosDropDown();
    }
}
