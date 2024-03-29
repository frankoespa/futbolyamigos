import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { TorneoDomain } from '../domain/TorneoDomain';
import { Torneo } from '../schema/TorneoSchema';


@Injectable()
export class TorneoRepository extends RepositoryBase<Torneo, TorneoDomain> {

    constructor (@InjectModel(Torneo.name) torneoModel: Model<Torneo>) {
        super(torneoModel, TorneoDomain);
    }

    async ObtenerTodosNoFinalizados (): Promise<Torneo[]> {

        return await this.model.find({ Finalizado: false }).exec();
    }

    async ObtenerTodosDiscriminandoDropDown (torneoDiscriminadoID: string): Promise<Torneo[]> {

        return await this.model.find({
            _id: { $ne: new Types.ObjectId(torneoDiscriminadoID) },
        }).exec()
    }

}