import { RequiredEmail } from '../../global/base/validations/RequiredEmail';
import { RequiredString } from '../../global/base/validations/RequiredString';

export class CreateUserDTO {

    @RequiredEmail()
    readonly Email: string;

    @RequiredString()
    readonly Password: string;

}