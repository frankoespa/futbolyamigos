import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLogic } from '../../user/providers/UserLogic';
import { JwtService } from '@nestjs/jwt';
import { ValidationException } from '../../global/base/exceptions/ValidationException';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose'

@Injectable()
export class AuthLogic {
    constructor (
        private usersLogic: UserLogic,
        private jwtService: JwtService,
        private configService: ConfigService) {}

    public async FindAndValidateCredentialsUser (email: string, password: string) {
        try
        {
            const user = await this.usersLogic.FindWithEmail(email);

            if (!user)
            {
                throw new UnauthorizedException();
            }

            await user.VerifyPassword(password);

            return user;

        } catch (error)
        {
            throw new ValidationException('Credenciales inválidas');
        }
    }

    public CreateCookieWithJwtToken (userId: Types.ObjectId) {
        const payload: { sub: Types.ObjectId } = { sub: userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME_API')}`;
    }

    public DeleteCookieForLogOut () {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}