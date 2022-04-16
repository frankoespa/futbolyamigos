import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { JugadorDomain } from '../domain/JugadorDomain';
import { Jugador } from '../schema/JugadorSchema';


@Injectable()
export class JugadorRepository extends RepositoryBase<Jugador, JugadorDomain> {

    constructor (@InjectModel(Jugador.name) jugadorModel: Model<Jugador>) {
        super(jugadorModel, JugadorDomain);
    }

    async YaExisteJugadorConDniSolicitado (dni: string) {

        const jugadorConDniSolicitado = await this.model.findOne({ Dni: dni }).exec();

        return jugadorConDniSolicitado ? true : false;
    }

}