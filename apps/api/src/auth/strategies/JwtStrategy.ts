import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { DocumentLoaderDomainService } from '../../shared/providers/DocumentLoaderDomainService';
import { User } from '../../user/schema/UserSchema';
import { UserDomain } from '../../user/domain/UserDomain';
import { Types } from "mongoose";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        private configService: ConfigService,
        private documentLoaderDomainService: DocumentLoaderDomainService) {

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    if (!(request?.cookies.Authentication))
                    {
                        throw new UnauthorizedException();
                    }
                    return request?.cookies?.Authentication
                }]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_API'),
        });

    }

    async validate (payload: { sub: Types.ObjectId }) {
        return await this.documentLoaderDomainService.GetById<User, UserDomain>(User.name, UserDomain, payload.sub);
    }
}