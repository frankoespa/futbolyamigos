import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { PartidoDomain } from '../domain/PartidoDomain';
import { Partido } from '../schema/PartidoSchema';


@Injectable()
export class PartidoRepository extends RepositoryBase<Partido, PartidoDomain> {

    constructor (@InjectModel(Partido.name) partidoModel: Model<Partido>) {
        super(partidoModel, PartidoDomain);
    }

}