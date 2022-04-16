import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RegistrarJugadorDTO } from '../dtos/RegistrarJugadorDTO';
import { JugadorLogic } from '../providers/JugadorLogic';
import { Auth } from '../../auth/decorators/AuthComposition';
import { DropDownVM, Roles, JugadorResultadoDataView, RegistrarJugadorVM } from "@futbolyamigos/data";
import { Types } from "mongoose";

@Controller('jugador')
export class JugadorController {
    constructor (private readonly jugadorLogic: JugadorLogic) {}

    @Auth([Roles.Admin])
    @Post()
    async Registrar (@Body() registrarJugadorDTO: RegistrarJugadorDTO): Promise<void> {

        return await this.jugadorLogic.Registrar(registrarJugadorDTO);
    }

    @Auth([Roles.Admin])
    @Get()
    async ObtenerTodos (): Promise<JugadorResultadoDataView[]> {

        return await this.jugadorLogic.ObtenerTodos();
    }

    @Auth([Roles.Admin])
    @Get(':id')
    async ObtenerPorId (@Param('id') id: Types.ObjectId): Promise<RegistrarJugadorVM> {

        return await this.jugadorLogic.ObtenerPorId(id);
    }

    @Auth([Roles.Admin])
    @Delete(':id')
    async Eliminar (@Param('id') id: Types.ObjectId): Promise<void> {

        return await this.jugadorLogic.EliminarPorId(id);
    }

    // @Auth([Roles.Admin])
    // @Get('dropdown/todos')
    // async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

    //     return await this.torneoLogic.ObtenerTodosDropDown();
    // }
}
