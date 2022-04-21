import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RegistrarEquipoDTO } from '../dtos/RegistrarEquipoDTO';
import { EquipoLogic } from '../providers/EquipoLogic';
import { Auth } from '../../auth/decorators/AuthComposition';
import { EquipoResultadoDataView, Roles, RegistrarEquipoVM, DropDownVM } from "@futbolyamigos/data";
import { Types } from "mongoose";

@Controller('equipo')
export class EquipoController {
    constructor (private readonly equipoLogic: EquipoLogic) {}

    @Auth([Roles.Admin])
    @Post()
    async Registrar (@Body() registrarEquipoDTO: RegistrarEquipoDTO): Promise<void> {

        return await this.equipoLogic.Registrar(registrarEquipoDTO);
    }

    @Auth([Roles.Admin])
    @Get()
    async ObtenerTodos (): Promise<EquipoResultadoDataView[]> {

        return await this.equipoLogic.ObtenerTodos();
    }

    @Auth([Roles.Admin])
    @Get(':id')
    async ObtenerPorId (@Param('id') id: Types.ObjectId): Promise<RegistrarEquipoVM> {

        return await this.equipoLogic.ObtenerPorId(id);
    }

    @Auth([Roles.Admin])
    @Delete(':id')
    async Eliminar (@Param('id') id: Types.ObjectId): Promise<void> {

        return await this.equipoLogic.EliminarPorId(id);
    }

    @Auth([Roles.Admin])
    @Get('dropdown/todos')
    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

        return await this.equipoLogic.ObtenerTodosDropDown();
    }

    @Auth([Roles.Admin])
    @Get('dropdown/todosDiscriminando')
    async ObtenerTodosDiscriminandoDropDown (@Query('torneoID') torneoID: string, @Query('equipoID') equipoID: string): Promise<DropDownVM<Types.ObjectId>[]> {
        return await this.equipoLogic.ObtenerTodosDiscriminandoDropDown(torneoID, equipoID);
    }
}
