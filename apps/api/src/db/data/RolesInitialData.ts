import { AnyKeys } from 'mongoose';
import { Role } from '../../role/schema/RoleSchema';

export const RolesInitialData: AnyKeys<Role>[] = [
    {
        _id: 1,
        Description: 'Admin'

    },
    {
        _id: 2,
        Description: 'Jugador'
    }
];