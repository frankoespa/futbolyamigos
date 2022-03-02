import { Controller } from '@nestjs/common';
import { UserLogic } from '../providers/UserLogic';


@Controller('users')
export class UserController {
    constructor (private readonly usersService: UserLogic) {}

}
