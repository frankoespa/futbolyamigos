import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { SancionDomain } from '../domain/SancionDomain';
import { Sancion } from '../schema/SancionSchema';


@Injectable()
export class SancionRepository extends RepositoryBase<Sancion, SancionDomain> {

    constructor (@InjectModel(Sancion.name) sancionModel: Model<Sancion>) {
        super(sancionModel, SancionDomain);
    }


}