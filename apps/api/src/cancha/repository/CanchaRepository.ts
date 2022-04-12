import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { CanchaDomain } from '../domain/CanchaDomain';
import { Cancha } from '../schema/CanchaSchema';


@Injectable()
export class CanchaRepository extends RepositoryBase<Cancha, CanchaDomain> {

    constructor (@InjectModel(Cancha.name) canchaModel: Model<Cancha>) {
        super(canchaModel, CanchaDomain);
    }

    async ElIdentificadorEstaEnUso (identificador: number) {
        const canchaConMismoIdentificador = await this.model.findOne({ Identificador: identificador }).exec();

        if (canchaConMismoIdentificador) return true
        else return false;
    }

}