import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { Roles, KeyRole } from '@futbolyamigos/data'

export const Authorization = (roles: Roles[]): CustomDecorator<string> => SetMetadata(KeyRole, roles);