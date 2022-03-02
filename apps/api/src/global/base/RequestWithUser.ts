import { Request } from 'express';
import { UserDomain } from "../../user/domain/UserDomain";

export interface RequestWithUser extends Request {
    user: UserDomain
}
