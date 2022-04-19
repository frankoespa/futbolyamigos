import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RegistrarPartidoDTO } from '../dtos/RegistrarPartidoDTO';
import { PartidoLogic } from '../providers/PartidoLogic';
import { Auth } from '../../auth/decorators/AuthComposition';
import { PartidoResultadoDataView, Roles } from "@futbolyamigos/data";

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

    // @Auth([Roles.Admin])
    // @Get(':id')
    // async ObtenerPorId (@Param('id') id: Types.ObjectId): Promise<RegistrarTorneoVM> {

    //     return await this.torneoLogic.ObtenerPorId(id);
    // }

    // @Auth([Roles.Admin])
    // @Delete(':id')
    // async Eliminar (@Param('id') id: Types.ObjectId): Promise<void> {

    //     return await this.torneoLogic.EliminarPorId(id);
    // }

    // @Auth([Roles.Admin])
    // @Get('dropdown/todos')
    // async ObtenerTodosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

    //     return await this.torneoLogic.ObtenerTodosDropDown();
    // }

    // @Auth([Roles.Admin])
    // @Get('dropdown/todosNoFinalizados')
    // async ObtenerTodosNoFinalizadosDropDown (): Promise<DropDownVM<Types.ObjectId>[]> {

    //     return await this.torneoLogic.ObtenerTodosNoFinalizadosDropDown();
    // }
}
