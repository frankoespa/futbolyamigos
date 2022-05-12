import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { TorneoCompuestoDomain } from '../domain/TorneoCompuestoDomain';
import { TorneoCompuesto } from '../schema/TorneoCompuestoSchema';


@Injectable()
export class TorneoCompuestoRepository extends RepositoryBase<TorneoCompuesto, TorneoCompuestoDomain> {

    constructor (@InjectModel(TorneoCompuesto.name) torneoCompuestoModel: Model<TorneoCompuesto>) {
        super(torneoCompuestoModel, TorneoCompuestoDomain);
    }

    async ObtenerTodosDiscriminandoDropDown (torneoID: string, equipoID?: string): Promise<TorneoCompuesto[]> {

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