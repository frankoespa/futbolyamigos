import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { Roles, KeyRole } from '../enums/Roles';

export const Authorization = (roles: Roles[]): CustomDecorator<string> => SetMetadata(KeyRole, roles);