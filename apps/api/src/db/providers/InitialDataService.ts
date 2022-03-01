import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Role } from '../../role/schema/RoleSchema';
import { RolesInitialData } from '../data/RolesInitialData';

@Injectable()
export class InitialDataService {
    constructor (@InjectConnection() private connection: Connection) {}

    async Initialize (): Promise<void> {
        await this.InitializeRoles();
    }

    private async InitializeRoles () {
        const RoleModel: Model<Role> = this.connection.model(Role.name);

        await RoleModel.deleteMany({}).exec();

        await RoleModel.create(RolesInitialData);
    }

}