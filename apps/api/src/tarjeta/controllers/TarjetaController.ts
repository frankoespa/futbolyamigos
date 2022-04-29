import { Controller, Get } from '@nestjs/common';
import { Auth } from '../../auth/decorators/AuthComposition';
import { TarjetaLogic } from '../providers/TarjetaLogic';
import { DropDownVM, Roles } from "@futbolyamigos/data";

@Controller('tarjeta')
export class TarjetaController {
    constructor (private readonly tarjetaLogic: TarjetaLogic) {}

    @Auth([Roles.Admin])
    @Get('dropdown/todos')
    async ObtenerTodosDropDown (): Promise<DropDownVM<number>[]> {

        return await this.tarjetaLogic.ObtenerTodosDropDown();
    }
}
