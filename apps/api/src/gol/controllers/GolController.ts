import { Controller } from '@nestjs/common';
import { GolLogic } from '../providers/GolLogic';

@Controller('gol')
export class GolController {
    constructor (private readonly golLogic: GolLogic) {}

}
