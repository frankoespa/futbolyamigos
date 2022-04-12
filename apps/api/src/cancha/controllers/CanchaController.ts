import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RegistrarCanchaDTO } from '../dtos/RegistrarCanchaDTO';
import { CanchaLogic } from '../providers/CanchaLogic';
import { Auth } from '../../auth/decorators/AuthComposition';
import { DropDownVM, RegistrarCanchaVM, Roles } from "@futbolyamigos/data";
import { Types } from "mongoose";

@Controller('cancha')
export class CanchaController {
    constructor (private readonly canchaLogic: CanchaLogic) {}

    @Auth([Roles.Admin])
    @Post()
    async Registrar (@Body() registrarCanchaDTO: RegistrarCanchaDTO): Promise<void> {

        return await this.canchaLogic.Registrar(registrarCanchaDTO);
    }

    @Auth([Roles.Admin])
    @Get()
    async ObtenerTodos (): Promise<RegistrarCanchaVM[]> {

        return await this.canchaLogic.ObtenerTodos();
    }

    @Auth([Roles.Admin])
    @Get(':id')
    async ObtenerPorId (@Param('id') id: Types.ObjectId): Promise<RegistrarCanchaVM> {

        return await this.canchaLogic.ObtenerPorId(id);
    }

    @Auth([Roles.Admin])
    @Delete(':id')
    async Eliminar (@Param('id') id: Types.ObjectId): Promise<void> {

        return await this.canchaLogic.EliminarPorId(id);
    }

    @Auth([Roles.Admin])
    @Get('todosDropDown')
    async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

        return await this.canchaLogic.ObtenerTodosDropDown();
    }
}
