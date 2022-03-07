import { Roles } from "../auth/Roles";
import { Types } from "mongoose";

export class UserDetailVM {
    _id: Types.ObjectId;
    Email: string;
    RoleID: Roles;
    Nombre?: string;
    Apellidos?: string
}