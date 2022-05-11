import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RegistrarPartidoDTO } from '../dtos/RegistrarPartidoDTO';
import { PartidoLogic } from '../providers/PartidoLogic';
import { Auth } from '../../auth/decorators/AuthComposition';
import { PartidoResultadoDataView, RegistrarPartidoVM, Roles, LineaTabla } from "@futbolyamigos/data";
import { Types } from "mongoose";

@Controller('partido')
export class PartidoController {
    constructor (private readonly partidoLogic: PartidoLogic) {}

    @Auth([Roles.Admin])
    @Post()
    async Registrar (@Body() registrarPartidoDTO: RegistrarPartidoDTO): Promise<void> {
        return await this.partidoLogic.Registrar(registrarPartidoDTO);
    }

    @Auth([Roles.Admin])
    @Get()
    async ObtenerTodos (): Promise<PartidoResultadoDataView[]> {

        return await this.partidoLogic.ObtenerTodos();
    }

    @Auth([Roles.Admin])
    @Get('obtenerTodosPorTorneo/:id')
    async ObtenerTodosPorTorneo (@Param('id') torneoID: Types.ObjectId): Promise<PartidoResultadoDataView[]> {

        return await this.partidoLogic.ObtenerTodosPorTorneo(torneoID);
    }

    @Auth([Roles.Admin])
    @Get(':id')
    async ObtenerPorId (@Param('id') id: Types.ObjectId): Promise<RegistrarPartidoVM> {

        return await this.partidoLogic.ObtenerPorId(id);
    }

    @Auth([Roles.Admin])
    @Delete(':id')
    async Eliminar (@Param('id') id: Types.ObjectId): Promise<void> {

        return await this.partidoLogic.EliminarPorId(id);
    }

    @Auth([Roles.Admin])
    @Get('tabla/:id')
    async ObtenerTablaPorTorneo (@Param('id') torneoID: Types.ObjectId): Promise<LineaTabla[]> {
        return await this.partidoLogic.ObtenerTabla(torneoID);
    }
}
