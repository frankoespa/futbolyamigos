import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { EquipoDomain } from '../domain/EquipoDomain';
import { Equipo } from '../schema/EquipoSchema';


@Injectable()
export class EquipoRepository extends RepositoryBase<Equipo, EquipoDomain> {

    constructor (@InjectModel(Equipo.name) equipoModel: Model<Equipo>) {
        super(equipoModel, EquipoDomain);
    }

    async ObtenerTodosDiscriminandoDropDown (torneoID: string, equipoID?: string): Promise<Equipo[]> {

        if (!equipoID)
        {
            return await this.model.find({
                Torneo: new Types.ObjectId(torneoID),
            }).exec()

        }

        return await this.model.find({
            _id: { $ne: new Types.ObjectId(equipoID) },
            Torneo: new Types.ObjectId(torneoID),
        }).exec()
    }

}