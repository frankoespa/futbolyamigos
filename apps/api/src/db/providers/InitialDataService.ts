import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Role } from '../../role/schema/RoleSchema';
import { Tarjeta } from '../../tarjeta/schema/TarjetaSchema';
import { RolesInitialData } from '../data/RolesInitialData';
import { TarjetasInitialData } from '../data/TarjetasInitialData';

@Injectable()
export class InitialDataService {
    constructor (@InjectConnection() private connection: Connection) {}

    async Initialize (): Promise<void> {
        await this.InitializeRoles();
        await this.InitializeTarjetas();
    }

    private async InitializeRoles () {
        const RoleModel: Model<Role> = this.connection.model(Role.name);

        await RoleModel.deleteMany({}).exec();

        await RoleModel.create(RolesInitialData);
    }

    private async InitializeTarjetas () {
        const TarjetaModel: Model<Tarjeta> = this.connection.model(Tarjeta.name);

        await TarjetaModel.deleteMany({}).exec();

        await TarjetaModel.create(TarjetasInitialData);
    }

}