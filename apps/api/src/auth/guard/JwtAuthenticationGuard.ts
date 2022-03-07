import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Roles, KeyRole } from '@futbolyamigos/data'
import { UserDomain } from '../../user/domain/UserDomain';

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {

    private Roles: Roles[] = []

    constructor (private reflector: Reflector) {
        super();
    }

    canActivate (context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        this.Roles = this.reflector.get<Roles[]>(KeyRole, context.getHandler());

        return super.canActivate(context);
    }

    handleRequest (error, user, info) {

        if (error)
        {
            throw new UnauthorizedException(error.message);
        }

        const userDomain = user as UserDomain;

        if (!this.Roles.length) return user;

        if (this.Roles.some((role) => userDomain.Doc.Role._id === role)) return user;

        throw new UnauthorizedException();
    }

}