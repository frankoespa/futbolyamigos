import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { EquipoDomain } from '../domain/EquipoDomain';
import { Equipo } from '../schema/EquipoSchema';


@Injectable()
export class EquipoRepository extends RepositoryBase<Equipo, EquipoDomain> {

    constructor (@InjectModel(Equipo.name) equipoModel: Model<Equipo>) {
        super(equipoModel, EquipoDomain);
    }

}