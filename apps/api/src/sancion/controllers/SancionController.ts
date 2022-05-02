import { Controller } from '@nestjs/common';
import { SancionLogic } from '../providers/SancionLogic';

@Controller('sancion')
export class SancionController {
    constructor (private readonly sancionLogic: SancionLogic) {}

}
