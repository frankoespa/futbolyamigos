import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { TarjetaDomain } from '../domain/TarjetaDomain';
import { Tarjeta } from '../schema/TarjetaSchema';


@Injectable()
export class TarjetaRepository extends RepositoryBase<Tarjeta, TarjetaDomain> {

    constructor (@InjectModel(Tarjeta.name) tarjetaModel: Model<Tarjeta>) {
        super(tarjetaModel, TarjetaDomain);
    }


}