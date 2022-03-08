import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '@futbolyamigos/data';
import JwtAuthenticationGuard from '../guard/JwtAuthenticationGuard';
import { Authorization } from '../../role/decorators/RoleDecorator';

export function Auth (
    roles: Roles[]
): <TFunction extends () => void, Y>(
        target: Record<string, any> | TFunction,
        propertyKey?: string | symbol,
        descriptor?: TypedPropertyDescriptor<Y>
    ) => void {
    return applyDecorators(Authorization(roles), UseGuards(JwtAuthenticationGuard));
}