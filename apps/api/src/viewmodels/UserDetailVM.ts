import { Types } from 'mongoose'
import { Roles } from '../role/enums/Roles'

export class UserDetailVM {
    _id: Types.ObjectId;
    Email: string;
    RoleID: Roles;
    Nombre?: string;
    Apellidos?: string
}