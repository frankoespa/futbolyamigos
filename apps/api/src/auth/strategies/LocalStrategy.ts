import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthLogic } from '../providers/AuthLogic';
import { UserDomain } from '../../user/domain/UserDomain';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private authLogic: AuthLogic) {
        super({
            usernameField: 'Email',
            passwordField: 'Password'
        });
    }

    async validate (email: string, password: string): Promise<UserDomain> {

        return await this.authLogic.FindAndValidateCredentialsUser(email, password);

    }
}