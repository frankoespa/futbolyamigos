import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { GolDomain } from '../domain/GolDomain';
import { Gol } from '../schema/GolSchema';


@Injectable()
export class GolRepository extends RepositoryBase<Gol, GolDomain> {

    constructor (@InjectModel(Gol.name) golModel: Model<Gol>) {
        super(golModel, GolDomain);
    }


}